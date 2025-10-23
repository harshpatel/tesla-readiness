import Header from '@/components/Header';
import QuizSidebar from '@/components/QuizSidebar';
import { getCurrentUser } from '@/lib/auth';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Define sections (will later fetch from Supabase)
const QUIZ_SECTIONS = [
  { key: 'prefixes', title: 'Prefixes', icon: '🔤' },
  { key: 'suffixes', title: 'Suffixes', icon: '📝' },
  { key: 'roots', title: 'Root Words', icon: '🌿' },
  { key: 'abbreviations', title: 'Abbreviations', icon: '📋' },
  { key: 'positioning', title: 'Patient Positioning', icon: '🧍' },
];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
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

  // Fetch section progress
  const { data: sectionProgress } = await supabase
    .from('user_section_progress')
    .select('*')
    .eq('user_id', user?.id);

  // Map progress to sections
  const sectionsWithProgress = QUIZ_SECTIONS.map((section) => {
    const progress = sectionProgress?.find((p) => p.section_key === section.key);
    return {
      ...section,
      progress: progress
        ? {
            mastered: progress.mastered_questions,
            total: progress.total_questions,
            completed: progress.completed,
          }
        : undefined,
    };
  });

  // Calculate overall stats
  const totalQuestions = sectionProgress?.reduce((sum, p) => sum + p.total_questions, 0) || 0;
  const masteredQuestions = sectionProgress?.reduce((sum, p) => sum + p.mastered_questions, 0) || 0;
  const completedSections = sectionProgress?.filter((p) => p.completed).length || 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Clinical Readiness Checks" showAuth={true} userEmail={user?.email} />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <QuizSidebar sections={sectionsWithProgress} />
        
        {/* Main Content */}
        <main className="flex-1 p-8 lg:ml-0">
          <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">
              Welcome back{user?.full_name ? `, ${user.full_name}` : ''}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Ready to continue your clinical readiness training?
            </p>
          </div>
          
          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Questions Mastered', value: masteredQuestions.toString(), emoji: '✓' },
              { label: 'Study Streak', value: '0 days', emoji: '🔥' },
              { label: 'Sections Completed', value: `${completedSections}/${QUIZ_SECTIONS.length}`, emoji: '📚' }
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
          </div>
        </main>
      </div>
    </div>
  );
}



