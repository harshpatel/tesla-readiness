import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { MODULE_COMPLETION_THRESHOLD, CONTENT_COMPLETION_THRESHOLD } from './constants';
import { isAdmin, getImpersonationState } from './auth';

export interface ModuleAccessStatus {
  canAccess: boolean;
  isLocked: boolean;
  reason?: string;
  unlockedByAdmin?: boolean;
  adminUnlockInfo?: {
    unlockedBy: string;
    unlockedAt: string;
  };
  previousModuleRequired?: {
    id: string;
    title: string;
    slug: string;
    sectionSlug: string;
  };
  completionStatus?: {
    contentComplete: boolean;
    quizComplete: boolean;
    contentProgress: number;
    quizAccuracy: number;
  };
}

/**
 * Check if a user can access a specific module based on sequential completion requirements
 * Admins bypass restrictions UNLESS they are impersonating (to see true student experience)
 * 
 * @param userId - The user ID to check access for
 * @param moduleId - The module ID to check
 * @param bypassAdminCheck - If true, don't check if the user is an admin (used when admin is checking another user's status)
 */
export async function getModuleAccessStatus(
  userId: string,
  moduleId: string,
  bypassAdminCheck = false
): Promise<ModuleAccessStatus> {
  // Only check admin status if not bypassed
  if (!bypassAdminCheck) {
    // Check if admin is impersonating - if so, apply restrictions
    const { isImpersonating } = await getImpersonationState();
    
    // Admins bypass all restrictions (but not during impersonation)
    if (!isImpersonating) {
      const userIsAdmin = await isAdmin();
      if (userIsAdmin) {
        return {
          canAccess: true,
          isLocked: false,
        };
      }
    }
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the current module details
  const { data: currentModule, error: moduleError } = await supabase
    .from('modules')
    .select('id, title, slug, section_id, order_index, section:sections(id, slug, title, order_index)')
    .eq('id', moduleId)
    .single();

  if (moduleError || !currentModule) {
    return {
      canAccess: false,
      isLocked: true,
      reason: 'Module not found',
    };
  }

  // Get all modules ordered by section and module order
  const { data: allModules, error: allModulesError } = await supabase
    .from('modules')
    .select('id, title, slug, section_id, order_index, section:sections!inner(id, slug, title, order_index, is_published)')
    .eq('is_published', true)
    .eq('section.is_published', true);

  if (allModulesError || !allModules || allModules.length === 0) {
    console.error('Error fetching modules for access check:', allModulesError);
    return {
      canAccess: false,
      isLocked: true,
      reason: 'Unable to determine module order',
    };
  }

  // Sort modules by section order_index, then module order_index
  const sortedModules = allModules.sort((a, b) => {
    const sectionA = Array.isArray(a.section) ? a.section[0] : a.section;
    const sectionB = Array.isArray(b.section) ? b.section[0] : b.section;
    
    if (sectionA.order_index !== sectionB.order_index) {
      return sectionA.order_index - sectionB.order_index;
    }
    return a.order_index - b.order_index;
  });

  // Find the current module's position in the sorted list
  const currentModuleIndex = sortedModules.findIndex(m => m.id === moduleId);

  console.log('🔍 Module Access Check:', {
    currentModuleTitle: currentModule.title,
    currentModuleIndex,
    totalModules: sortedModules.length,
    isFirstModule: currentModuleIndex === 0,
    firstModuleTitle: sortedModules[0]?.title,
  });

  // First module (index 0) is always unlocked
  if (currentModuleIndex === 0) {
    console.log('✅ First module - always unlocked:', currentModule.title);
    return {
      canAccess: true,
      isLocked: false,
    };
  }

  // Module not found in list (shouldn't happen)
  if (currentModuleIndex === -1) {
    console.error('❌ Module not found in sorted list:', currentModule.title);
    return {
      canAccess: false,
      isLocked: true,
      reason: 'Module not found in curriculum',
    };
  }

  // Check if the previous module is complete
  const previousModule = sortedModules[currentModuleIndex - 1];
  const previousModuleComplete = await isModuleComplete(userId, previousModule.id);

  if (!previousModuleComplete.isComplete) {
    // Module would be locked - check for admin override
    const { data: override } = await supabase
      .from('user_module_overrides')
      .select('is_unlocked, unlocked_by, created_at, unlocked_by_profile:profiles!user_module_overrides_unlocked_by_fkey(first_name, last_name, email)')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .eq('is_unlocked', true)
      .single();

    if (override) {
      // Admin has unlocked this module
      const unlockerProfile = Array.isArray(override.unlocked_by_profile) 
        ? override.unlocked_by_profile[0] 
        : override.unlocked_by_profile;
      
      const unlockerName = unlockerProfile?.first_name && unlockerProfile?.last_name
        ? `${unlockerProfile.first_name} ${unlockerProfile.last_name}`
        : unlockerProfile?.email || 'Admin';

      return {
        canAccess: true,
        isLocked: false,
        unlockedByAdmin: true,
        adminUnlockInfo: {
          unlockedBy: unlockerName,
          unlockedAt: override.created_at,
        },
      };
    }

    // No override, module is locked
    const prevSection = Array.isArray(previousModule.section) 
      ? previousModule.section[0] 
      : previousModule.section;

    return {
      canAccess: false,
      isLocked: true,
      reason: `You must complete "${previousModule.title}" before accessing this module.`,
      previousModuleRequired: {
        id: previousModule.id,
        title: previousModule.title,
        slug: previousModule.slug,
        sectionSlug: prevSection.slug,
      },
      completionStatus: previousModuleComplete.status,
    };
  }

  // All checks passed - legitimately unlocked
  return {
    canAccess: true,
    isLocked: false,
  };
}

/**
 * Check if a module is complete based on content and quiz completion requirements
 */
export async function isModuleComplete(
  userId: string,
  moduleId: string
): Promise<{
  isComplete: boolean;
  status: {
    contentComplete: boolean;
    quizComplete: boolean;
    contentProgress: number;
    quizAccuracy: number;
  };
}> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // Get all content items for this module
  const { data: contentItems, error: contentError } = await supabase
    .from('content_items')
    .select('id, type')
    .eq('module_id', moduleId)
    .eq('is_published', true);

  if (contentError || !contentItems || contentItems.length === 0) {
    return {
      isComplete: false,
      status: {
        contentComplete: false,
        quizComplete: false,
        contentProgress: 0,
        quizAccuracy: 0,
      },
    };
  }

  // Separate quizzes from other content
  const quizItems = contentItems.filter(item => item.type === 'quiz');
  const nonQuizItems = contentItems.filter(item => item.type !== 'quiz');

  // Check content completion (non-quiz items)
  let contentComplete = true;
  let completedContentCount = 0;

  if (nonQuizItems.length > 0) {
    const { data: contentProgress } = await supabase
      .from('user_content_progress')
      .select('content_item_id, completed')
      .eq('user_id', userId)
      .in('content_item_id', nonQuizItems.map(item => item.id));

    completedContentCount = contentProgress?.filter(p => p.completed).length || 0;
    contentComplete = completedContentCount >= nonQuizItems.length * CONTENT_COMPLETION_THRESHOLD;
  }

  const contentProgress = nonQuizItems.length > 0 
    ? completedContentCount / nonQuizItems.length 
    : 1; // If no non-quiz content, consider it complete

  // Check quiz completion (must pass with threshold accuracy)
  let quizComplete = true;
  let totalCorrect = 0;
  let totalReviews = 0;

  if (quizItems.length > 0) {
    const { data: quizProgress } = await supabase
      .from('user_quiz_progress')
      .select('content_item_id, correct_reviews, total_reviews')
      .eq('user_id', userId)
      .in('content_item_id', quizItems.map(item => item.id));

    if (!quizProgress || quizProgress.length < quizItems.length) {
      // Not all quizzes attempted
      quizComplete = false;
    } else {
      // Calculate overall quiz accuracy for this module
      quizProgress.forEach(qp => {
        totalCorrect += qp.correct_reviews;
        totalReviews += qp.total_reviews;
      });

      const quizAccuracy = totalReviews > 0 ? totalCorrect / totalReviews : 0;
      quizComplete = quizAccuracy >= MODULE_COMPLETION_THRESHOLD;
    }
  }

  // Calculate quiz accuracy for display
  // If no quizzes exist in module, return 1 (100%) - module can be completed
  // If quizzes exist but none attempted, return 0 (0%) - user needs to take them
  const quizAccuracy = quizItems.length === 0 
    ? 1 // No quizzes in this module, so "complete" from quiz perspective
    : totalReviews > 0 
      ? totalCorrect / totalReviews // Has quiz attempts, calculate actual accuracy
      : 0; // Has quizzes but no attempts yet, show 0%

  const isComplete = contentComplete && quizComplete;

  return {
    isComplete,
    status: {
      contentComplete,
      quizComplete,
      contentProgress,
      quizAccuracy,
    },
  };
}

/**
 * Get the first incomplete module for a user (useful for redirects)
 */
export async function getFirstIncompleteModule(userId: string): Promise<{
  id: string;
  slug: string;
  sectionSlug: string;
  title: string;
} | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // Get all modules ordered by section and module order
  const { data: allModules } = await supabase
    .from('modules')
    .select('id, title, slug, section_id, order_index, section:sections(id, slug, title, order_index)')
    .eq('is_published', true)
    .order('section.order_index', { ascending: true })
    .order('order_index', { ascending: true });

  if (!allModules || allModules.length === 0) {
    return null;
  }

  // Sort modules by section order_index, then module order_index
  const sortedModules = allModules.sort((a, b) => {
    const sectionA = Array.isArray(a.section) ? a.section[0] : a.section;
    const sectionB = Array.isArray(b.section) ? b.section[0] : b.section;
    
    if (sectionA.order_index !== sectionB.order_index) {
      return sectionA.order_index - sectionB.order_index;
    }
    return a.order_index - b.order_index;
  });

  // Find the first incomplete module
  for (const module of sortedModules) {
    const completionStatus = await isModuleComplete(userId, module.id);
    if (!completionStatus.isComplete) {
      const section = Array.isArray(module.section) ? module.section[0] : module.section;
      return {
        id: module.id,
        slug: module.slug,
        sectionSlug: section.slug,
        title: module.title,
      };
    }
  }

  // All modules complete
  return null;
}

