import { notFound, redirect } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import ModuleSidebar from '@/components/ModuleSidebar';
import DocumentViewer from '@/components/DocumentViewer';
import ElevenLabsWidget from '@/components/ElevenLabsWidget';

interface PageProps {
  params: Promise<{
    section: string;
    module: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section, module, slug } = await params;
  
  return {
    title: `Document: ${slug} | TeslaMR`,
    description: 'Document content for Tesla MRI Training',
  };
}

export default async function DocumentPage({ params }: PageProps) {
  const { section, module, slug } = await params;
  
  // Auth check
  const user = await getCurrentUser();
  if (!user) {
    redirect('/');
  }

  const userIsAdmin = await isAdmin();

  // Initialize Supabase client
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  // Fetch section data
  const { data: sectionData } = await supabase
    .from('sections')
    .select('*')
    .eq('slug', section)
    .single();

  if (!sectionData) {
    notFound();
  }

  // Fetch module data
  const { data: moduleData } = await supabase
    .from('modules')
    .select('*')
    .eq('slug', module)
    .eq('section_id', sectionData.id)
    .single();

  if (!moduleData) {
    notFound();
  }

  // Fetch content item
  const { data: contentItem } = await supabase
    .from('content_items')
    .select('*')
    .eq('slug', slug)
    .eq('module_id', moduleData.id)
    .eq('type', 'document')
    .single();

  if (!contentItem) {
    notFound();
  }

  // Fetch user progress for this content item
  const { data: userProgress } = await supabase
    .from('user_content_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('content_item_id', contentItem.id)
    .single();

  // Fetch user's first name for ElevenLabs widget
  const { data: profileData } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single();

  const documentUrl = contentItem.metadata?.documentUrl || '';
  const checkboxes = contentItem.metadata?.checkboxes || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title={`${contentItem.icon} ${contentItem.title}`}
        showAuth 
        showBackButton 
        userEmail={user.email}
        isAdmin={userIsAdmin}
      />
      <div className="flex flex-1">
        {/* Sidebar */}
        <ModuleSidebar />
        
        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/dashboard" className="hover:text-[#0A84FF]">Dashboard</Link>
              <span className="mx-2">/</span>
              <Link href={`/${section}`} className="hover:text-[#0A84FF]">{sectionData.title}</Link>
              <span className="mx-2">/</span>
              <Link href={`/${section}/${module}`} className="hover:text-[#0A84FF]">{moduleData.title}</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 dark:text-white font-medium">{contentItem.title}</span>
            </nav>

            {/* Combined Card with Header and Content */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
              {/* Content Header */}
              <div className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-6xl">{contentItem.icon}</span>
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-[#1a1a1a] dark:text-white mb-2">
                      {contentItem.title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {contentItem.description}
                    </p>
                  </div>
                </div>

                {userProgress?.completed && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Completed</span>
                  </div>
                )}
              </div>

              {/* Dashed Divider */}
              <div className="border-t-2 border-dashed border-gray-300 dark:border-slate-600 mx-8"></div>

              {/* Document Viewer Content (without outer container) */}
              <DocumentViewer
                documentUrl={documentUrl}
                checkboxes={checkboxes}
                userId={user.id}
                contentItemId={contentItem.id}
                isCompleted={userProgress?.completed || false}
              />
            </div>
          </div>
        </main>
      </div>
      <ElevenLabsWidget firstName={profileData?.first_name || undefined} />
    </div>
  );
}

