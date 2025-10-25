import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import { getModuleAccessStatus } from '@/lib/module-access';
import ModuleSidebarClient from './ModuleSidebarClient';

export default async function ModuleSidebar() {
  const user = await getCurrentUser();
  
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

  // Fetch all sections
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .order('order_index');

  if (!sections) {
    return null;
  }

  // Fetch all modules
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .order('order_index');

  // Fetch all content items
  const { data: contentItems } = await supabase
    .from('content_items')
    .select('*')
    .eq('is_published', true)
    .order('order_index');

  // Fetch user progress if logged in
  let userContentProgress: any[] = [];
  let userModuleProgress: any[] = [];
  let userSectionProgress: any[] = [];

  if (user) {
    const { data: contentProgress } = await supabase
      .from('user_content_progress')
      .select('*')
      .eq('user_id', user.id);
    userContentProgress = contentProgress || [];

    const { data: moduleProgress } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', user.id);
    userModuleProgress = moduleProgress || [];

    const { data: sectionProgress } = await supabase
      .from('user_section_progress')
      .select('*')
      .eq('user_id', user.id);
    userSectionProgress = sectionProgress || [];
  }

  // Build hierarchical structure
  const sectionsWithData = await Promise.all(sections.map(async (section) => {
    const sectionModules = (modules || []).filter((m) => m.section_id === section.id);
    const sectionProgressData = userSectionProgress.find((p) => p.section_id === section.id);

    const modulesWithContent = await Promise.all(sectionModules.map(async (module) => {
      const moduleContentItems = (contentItems || []).filter((ci) => ci.module_id === module.id);
      const moduleProgressData = userModuleProgress.find((p) => p.module_id === module.id);

      const itemsWithProgress = moduleContentItems.map((item) => {
        const itemProgress = userContentProgress.find((p) => p.content_item_id === item.id);
        return {
          id: item.id,
          slug: item.slug,
          title: item.title,
          icon: item.icon || '📄',
          type: item.type,
          progress: itemProgress
            ? {
                completed: itemProgress.completed,
              }
            : undefined,
        };
      });

      // Check module access status
      let accessStatus = { canAccess: true, isLocked: false };
      if (user) {
        accessStatus = await getModuleAccessStatus(user.id, module.id);
      }

      return {
        id: module.id,
        slug: module.slug,
        title: module.title,
        icon: module.icon || '📚',
        sectionSlug: section.slug,
        isPublished: module.is_published,
        isLocked: accessStatus.isLocked,
        lockReason: accessStatus.reason,
        previousModuleRequired: accessStatus.previousModuleRequired,
        completionStatus: accessStatus.completionStatus,
        contentItems: itemsWithProgress,
        progress: moduleProgressData
          ? {
              completedItems: moduleProgressData.completed_items,
              totalItems: moduleProgressData.total_items,
              progressPercent: moduleProgressData.progress_percent,
            }
          : undefined,
      };
    }));

    return {
      id: section.id,
      slug: section.slug,
      title: section.title,
      icon: section.icon || '📖',
      isPublished: section.is_published,
      modules: modulesWithContent,
      progress: sectionProgressData
        ? {
            completedModules: sectionProgressData.completed_modules,
            totalModules: sectionProgressData.total_modules,
            progressPercent: sectionProgressData.progress_percent,
          }
        : undefined,
    };
  }));

  return <ModuleSidebarClient sections={sectionsWithData} />;
}

