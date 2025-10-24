import Header from '@/components/Header';
import ModuleSidebar from '@/components/ModuleSidebar';
import ProfileCompletionModal from '@/components/ProfileCompletionModal';
import ElevenLabsWidget from '@/components/ElevenLabsWidget';
import { getCurrentUser } from '@/lib/auth';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Track your progress through the MRI Technologist Curriculum',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/');
  }
  
  // Fetch user's progress for each section
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
    .eq('is_published', true)
    .order('order_index');

  // Fetch user's section progress
  const { data: sectionProgress } = await supabase
    .from('user_section_progress')
    .select('*')
    .eq('user_id', user?.id);

  // Fetch user's content progress to count completed items
  const { data: contentProgress } = await supabase
    .from('user_content_progress')
    .select('*')
    .eq('user_id', user?.id)
    .eq('completed', true);

  const completedContentItems = contentProgress?.length || 0;

  // Get total content items
  const { count: totalContentCount } = await supabase
    .from('content_items')
    .select('id', { count: 'exact', head: true })
    .eq('is_published', true);
  
  const totalContent = totalContentCount || 0;
  
  // Calculate overall stats
  const completedSections = sectionProgress?.filter((p) => p.progress_percent === 100).length || 0;
  const totalSections = sections?.length || 0;
  
  // Get user's current streak and profile data
  const { data: profileData } = await supabase
    .from('profiles')
    .select('current_streak, last_activity_date, first_name, last_name, phone, date_of_birth')
    .eq('id', user?.id)
    .single();
  
  const currentStreak = profileData?.current_streak || 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Profile Completion Modal */}
      <ProfileCompletionModal 
        userId={user!.id} 
        currentProfile={profileData}
      />
      
      <Header title="MRI Technologist Curriculum" showAuth={true} userEmail={user?.email} />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <ModuleSidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-8 lg:ml-0">
          <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">
              Welcome back{profileData?.first_name ? `, ${profileData.first_name}` : ''}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Ready to continue your MRI technologist training?
            </p>
          </div>
          
          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Content Completed', value: `${completedContentItems}/${totalContent}`, emoji: '✓' },
              { label: 'Study Streak', value: `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`, emoji: '🔥' },
              { label: 'Sections Completed', value: `${completedSections}/${totalSections}`, emoji: '📚' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="p-6 rounded-xl border border-gray-200 text-center"
                style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                  animation: `fadeIn 0.6s ease-out ${0.2 + index * 0.1}s backwards`
                }}
              >
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className="text-2xl font-bold text-[#1a1a1a] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Access to Sections */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">Your Learning Path</h2>
            <div className="grid gap-4">
              {sections?.map((section) => {
                const progress = sectionProgress?.find((p) => p.section_id === section.id);
                const progressPercent = progress?.progress_percent || 0;

                return (
                  <Link
                    key={section.id}
                    href={`/${section.slug}`}
                    className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 hover:border-[#0A84FF]"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{section.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#1a1a1a] mb-1">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                        {progress && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#0A84FF] to-[#0077ED]"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">{progressPercent}%</span>
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
          </div>
          </div>
        </main>
      </div>
      <ElevenLabsWidget firstName={profileData?.first_name || undefined} />
    </div>
  );
}



