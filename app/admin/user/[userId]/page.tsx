import Header from '@/components/Header';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserDetailView from '@/components/UserDetailView';

interface UserDetailPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  // Require admin access
  await requireAdmin();
  
  const currentUser = await getCurrentUser();
  const { userId } = await params;
  
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
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
  
  // Fetch user profile
  const { data: userProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (profileError || !userProfile) {
    redirect('/admin');
  }
  
  // Fetch all section progress for this user
  const { data: sectionProgress } = await supabase
    .from('user_section_progress')
    .select('*')
    .eq('user_id', userId);
  
  // Fetch all question progress for this user
  const { data: questionProgress } = await supabase
    .from('user_quiz_progress')
    .select('*')
    .eq('user_id', userId)
    .order('last_attempt_date', { ascending: false });
  
  // Fetch all quiz questions to get full question details
  const { data: allQuestions } = await supabase
    .from('quiz_questions')
    .select('*');
  
  // Fetch all quiz sections
  const { data: allSections } = await supabase
    .from('quiz_sections')
    .select('*');
  
  // Calculate total questions
  const { count: totalQuestionsCount } = await supabase
    .from('quiz_questions')
    .select('id', { count: 'exact', head: true });
  
  const totalQuestions = totalQuestionsCount || 88;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title="User Details" 
        showAuth={true} 
        showBackButton={true} 
        userEmail={currentUser?.email} 
      />
      
      <main className="flex-1 p-8">
        <UserDetailView
          userProfile={userProfile}
          sectionProgress={sectionProgress || []}
          questionProgress={questionProgress || []}
          allQuestions={allQuestions || []}
          allSections={allSections || []}
          totalQuestions={totalQuestions}
        />
      </main>
    </div>
  );
}

