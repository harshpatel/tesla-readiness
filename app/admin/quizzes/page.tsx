import { redirect } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import Header from '@/components/Header';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminQuizzesClient from '@/components/AdminQuizzesClient';

// Mapping of quiz slug to numbered hint file
const QUIZ_FILE_NUMBERS: Record<string, string> = {
  'introduction-quiz': '01',
  'fundamentals': '02',
  'prefixes': '03',
  'suffixes': '04',
  'roots': '05',
  'abbreviations': '06',
  'positioning': '07',
  'anatomy-fundamentals': '08',
  'neuro-procedures-fundamentals': '09',
  'body-msk-fundamentals': '10',
};

export default async function AdminQuizzesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/');
  }

  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    redirect('/dashboard');
  }

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

  // Fetch all quiz content items
  const { data: quizzes } = await supabase
    .from('content_items')
    .select(`
      id,
      slug,
      title,
      module:modules(title, slug, section:sections(title, slug))
    `)
    .eq('type', 'quiz')
    .eq('is_published', true)
    .order('slug');

  // Fetch all quiz questions from DB
  const { data: allQuestions } = await supabase
    .from('quiz_questions')
    .select('*')
    .order('section_key')
    .order('order_index');

  // Group questions by section_key
  const questionsBySection: Record<string, any[]> = {};
  allQuestions?.forEach(q => {
    if (!questionsBySection[q.section_key]) {
      questionsBySection[q.section_key] = [];
    }
    questionsBySection[q.section_key].push(q);
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Admin - Quiz Data" showAuth userEmail={user?.email} isAdmin={userIsAdmin} />
      <AdminQuizzesClient 
        quizzes={quizzes || []}
        questionsBySection={questionsBySection}
        quizFileNumbers={QUIZ_FILE_NUMBERS}
      />
    </div>
  );
}
