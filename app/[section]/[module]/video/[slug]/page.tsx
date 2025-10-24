import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import ModuleSidebar from '@/components/ModuleSidebar';
import VideoPlayer from '@/components/VideoPlayer';
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
    title: `Video: ${slug} | TeslaMR`,
    description: 'Video content for Tesla MRI Training',
  };
}

export default async function VideoPage({ params }: PageProps) {
  const { section, module, slug } = await params;
  
  // Auth check
  const user = await getCurrentUser();
  if (!user) {
    redirect('/');
  }

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
    .eq('type', 'video')
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

  const videoUrl = contentItem.metadata?.videoUrl || '';

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title={`${contentItem.icon} ${contentItem.title}`}
        showAuth 
        showBackButton 
        userEmail={user.email} 
      />
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
              <Link href={`/${section}/${module}`} className="hover:text-[#0A84FF]">{moduleData.title}</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{contentItem.title}</span>
            </nav>

            {/* Combined Card with Header and Video */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Content Header */}
              <div className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-6xl">{contentItem.icon}</span>
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-[#1a1a1a] mb-2">
                      {contentItem.title}
                    </h1>
                    <p className="text-lg text-gray-600">
                      {contentItem.description}
                    </p>
                  </div>
                </div>

                {userProgress?.completed && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm font-medium text-green-700">Completed</span>
                  </div>
                )}
              </div>

              {/* Dashed Divider */}
              <div className="border-t-2 border-dashed border-gray-300 mx-8"></div>

              {/* Video Player */}
              <VideoPlayer
                videoUrl={videoUrl}
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

