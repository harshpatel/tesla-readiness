import { notFound, redirect } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import ModuleSidebar from '@/components/ModuleSidebar';
import ElevenLabsWidget from '@/components/ElevenLabsWidget';
import ModulePageClient from '@/components/ModulePageClient';
import { getModuleAccessStatus } from '@/lib/module-access';

interface PageProps {
  params: Promise<{
    section: string;
    module: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section, module } = await params;
  
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

  // Fetch module
  const { data: moduleData } = await supabase
    .from('modules')
    .select(`
      *,
      section:sections(*)
    `)
    .eq('slug', module)
    .single();

  if (!moduleData) {
    return { title: 'Module Not Found' };
  }

  return {
    title: moduleData.title,
    description: moduleData.description || `Explore ${moduleData.title}`,
  };
}

export default async function ModulePage({ params }: PageProps) {
  const { section, module } = await params;
  
  // Ensure user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    redirect('/');
  }

  const userIsAdmin = await isAdmin();

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

  // Fetch module with section info
  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .select(`
      *,
      section:sections(*)
    `)
    .eq('slug', module)
    .single();

  if (moduleError || !moduleData) {
    console.error('Module not found:', moduleError);
    notFound();
  }

  // Verify the section matches the URL
  const sectionData = moduleData.section as any;
  if (sectionData?.slug !== section) {
    notFound();
  }

  // Fetch content items for this module
  const { data: contentItems, error: contentError } = await supabase
    .from('content_items')
    .select('*')
    .eq('module_id', moduleData.id)
    .eq('is_published', true)
    .order('order_index');

  if (contentError) {
    console.error('Error fetching content items:', contentError);
  }

  // Fetch user's progress for these content items
  const { data: userProgress } = await supabase
    .from('user_content_progress')
    .select('*')
    .eq('user_id', user.id)
    .in('content_item_id', (contentItems || []).map(ci => ci.id));

  // Fetch module progress
  const { data: moduleProgress } = await supabase
    .from('user_module_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('module_id', moduleData.id)
    .single();

  // Fetch user's first name for ElevenLabs widget
  const { data: profileData } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single();

  const contentItemsWithProgress = (contentItems || []).map((item) => {
    const progress = userProgress?.find((p) => p.content_item_id === item.id);
    return {
      ...item,
      progress: progress
        ? {
            completed: progress.completed,
            score: progress.score,
            attempts: progress.attempts,
          }
        : undefined,
    };
  });

  const progressPercent = moduleProgress?.progress_percent || 0;
  const completedItems = contentItemsWithProgress.filter(ci => ci.progress?.completed).length;
  const totalItems = contentItemsWithProgress.length;

  // Check module access
  const accessStatus = await getModuleAccessStatus(user.id, moduleData.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title="MRI Technologist Curriculum"
        showAuth={true}
        userEmail={user?.email}
        isAdmin={userIsAdmin}
      />
      <div className="flex flex-1">
        {/* Sidebar */}
        <ModuleSidebar />
        
        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <ModulePageClient
            moduleData={moduleData}
            sectionData={sectionData}
            contentItemsWithProgress={contentItemsWithProgress}
            progressPercent={progressPercent}
            completedItems={completedItems}
            totalItems={totalItems}
            section={section}
            module={module}
            accessStatus={accessStatus}
          />
        </main>
      </div>
      <ElevenLabsWidget firstName={profileData?.first_name || undefined} />
    </div>
  );
}

