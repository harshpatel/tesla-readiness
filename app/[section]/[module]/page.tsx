import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import ModuleSidebar from '@/components/ModuleSidebar';

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
    redirect('/login');
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <ModuleSidebar />
        
        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-600">
            <Link href="/dashboard" className="hover:text-[#0A84FF]">Dashboard</Link>
            <span className="mx-2">/</span>
            <Link href={`/${section}`} className="hover:text-[#0A84FF]">{sectionData.title}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{moduleData.title}</span>
          </nav>

          {/* Combined Card with Header and Content Items */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Module Header */}
            <div className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">{moduleData.icon || '📚'}</span>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
                    {moduleData.title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {moduleData.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {totalItems > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Your Progress: {completedItems} / {totalItems} completed
                    </span>
                    <span className="text-sm font-bold text-[#0A84FF]">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0A84FF] to-[#0077ED] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Dashed Divider */}
            {contentItemsWithProgress.length > 0 && (
              <div className="border-t-2 border-dashed border-gray-300 mx-8"></div>
            )}

            {/* Content Items List */}
            {contentItemsWithProgress.length > 0 && (
              <div className="p-8 space-y-4">
            {contentItemsWithProgress.map((item) => {
              const isCompleted = item.progress?.completed || false;
              const typeLabel = item.type === 'quiz' ? '📝 Quiz' : 
                               item.type === 'video' ? '🎥 Video' :
                               item.type === 'reading' ? '📖 Reading' : item.type;
              
              const href = item.type === 'quiz' 
                ? `/${section}/${module}/quiz/${item.slug}`
                : `/${section}/${module}/${item.type}/${item.slug}`;

              return (
                <Link
                  key={item.id}
                  href={href}
                  className="block bg-gray-50 rounded-xl hover:bg-gray-100 transition-all p-6 border border-gray-200 hover:border-[#0A84FF]"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{item.icon || '📄'}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold text-[#1a1a1a]">
                          {item.title}
                        </h3>
                        {isCompleted && (
                          <span className="text-green-600 text-lg">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="mt-2">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {typeLabel}
                        </span>
                      </div>
                    </div>
                    <div className="text-[#0A84FF]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
              </div>
            )}

            {/* Empty State */}
            {(!contentItems || contentItems.length === 0) && (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">No content available yet. Check back soon!</p>
              </div>
            )}
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}

