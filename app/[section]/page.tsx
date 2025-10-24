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
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section } = await params;
  
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

  // Fetch section
  const { data: sectionData } = await supabase
    .from('sections')
    .select('*')
    .eq('slug', section)
    .single();

  if (!sectionData) {
    return { title: 'Section Not Found' };
  }

  return {
    title: sectionData.title,
    description: sectionData.description || `Explore ${sectionData.title}`,
  };
}

export default async function SectionPage({ params }: PageProps) {
  const { section } = await params;
  
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

  // Fetch section
  const { data: sectionData, error: sectionError } = await supabase
    .from('sections')
    .select('*')
    .eq('slug', section)
    .single();

  if (sectionError || !sectionData) {
    console.error('Section not found:', sectionError);
    notFound();
  }

  // Fetch modules for this section
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('*')
    .eq('section_id', sectionData.id)
    .eq('is_published', true)
    .order('order_index');

  if (modulesError) {
    console.error('Error fetching modules:', modulesError);
  }

  // Fetch user's progress for these modules
  const { data: userProgress } = await supabase
    .from('user_module_progress')
    .select('*')
    .eq('user_id', user.id)
    .in('module_id', (modules || []).map(m => m.id));

  // Fetch section progress
  const { data: sectionProgress } = await supabase
    .from('user_section_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('section_id', sectionData.id)
    .single();

  const modulesWithProgress = (modules || []).map((mod) => {
    const progress = userProgress?.find((p) => p.module_id === mod.id);
    return {
      ...mod,
      progress: progress
        ? {
            completedItems: progress.completed_items,
            totalItems: progress.total_items,
            progressPercent: progress.progress_percent,
          }
        : undefined,
    };
  });

  const progressPercent = sectionProgress?.progress_percent || 0;
  const completedModules = modulesWithProgress.filter(m => m.progress?.progressPercent === 100).length;
  const totalModules = modulesWithProgress.length;

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
            <span className="text-gray-900 font-medium">{sectionData.title}</span>
          </nav>

          {/* Combined Card with Header and Modules */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Section Header */}
            <div className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-6xl">{sectionData.icon || '📖'}</span>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
                    {sectionData.title}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {sectionData.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {totalModules > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Your Progress: {completedModules} / {totalModules} modules completed
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
            {modulesWithProgress.length > 0 && (
              <div className="border-t-2 border-dashed border-gray-300 mx-8"></div>
            )}

            {/* Modules List */}
            {modulesWithProgress.length > 0 && (
              <div className="p-8 space-y-4">
            {modulesWithProgress.map((mod) => {
              const isCompleted = mod.progress?.progressPercent === 100;
              const progressPercent = mod.progress?.progressPercent || 0;
              const completedItems = mod.progress?.completedItems || 0;
              const totalItems = mod.progress?.totalItems || 0;

              return (
                <Link
                  key={mod.id}
                  href={`/${section}/${mod.slug}`}
                  className="block bg-gray-50 rounded-xl hover:bg-gray-100 transition-all p-6 border border-gray-200 hover:border-[#0A84FF]"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{mod.icon || '📚'}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-semibold text-[#1a1a1a]">
                          {mod.title}
                        </h3>
                        {isCompleted && (
                          <span className="text-green-600 text-xl">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{mod.description}</p>
                      
                      {/* Module Progress Bar */}
                      {totalItems > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1.5 text-xs">
                            <span className="text-gray-600">
                              {completedItems} / {totalItems} completed
                            </span>
                            <span className="font-bold text-[#0A84FF]">
                              {progressPercent}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#0A84FF] to-[#0077ED]"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
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
            {(!modules || modules.length === 0) && (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-lg">No modules available yet. Check back soon!</p>
              </div>
            )}
          </div>
          </div>
        </main>
      </div>
    </div>
  );
}

