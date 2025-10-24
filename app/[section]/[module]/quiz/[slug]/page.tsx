import { notFound, redirect } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import QuizInterface from '@/components/QuizInterface';
import ElevenLabsWidget from '@/components/ElevenLabsWidget';
import ModuleSidebar from '@/components/ModuleSidebar';
import Header from '@/components/Header';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    section: string;
    module: string;
    slug: string;
  }>;
}

// Icon mapping for quiz sections
const QUIZ_ICONS: Record<string, string> = {
  'prefixes': '🔤',
  'suffixes': '📝',
  'roots': '🌿',
  'abbreviations': '📋',
  'positioning': '🧍',
  'introduction-quiz': '📝',
  'fundamentals': '🫀',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { module, slug } = await params;
  
  // Query DB for content item to get title and description
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

  const { data: contentItem } = await supabase
    .from('content_items')
    .select('title, description')
    .eq('slug', slug)
    .eq('type', 'quiz')
    .single();
  
  if (!contentItem) {
    return { title: 'Quiz Not Found' };
  }

  return {
    title: `${contentItem.title} Quiz`,
    description: contentItem.description || `Master ${contentItem.title.toLowerCase()} with interactive quizzes.`,
  };
}

export default async function QuizPage({ params }: PageProps) {
  const { section, module, slug } = await params;
  
  // Ensure user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    redirect('/');
  }

  const userIsAdmin = await isAdmin();

  // Fetch user's profile data for first name
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

  const { data: profileData } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single();

  // Get content item (quiz) from database
  const { data: contentItem } = await supabase
    .from('content_items')
    .select('id, title, description, slug')
    .eq('slug', slug)
    .eq('type', 'quiz')
    .single();

  if (!contentItem) {
    notFound();
  }

  // Fetch quiz questions from database
  console.log('🔍 [DB QUERY] Fetching quiz questions from database for content_item_id:', contentItem.id);
  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('content_item_id', contentItem.id)
    .order('order_index', { ascending: true });

  if (questionsError || !questions || questions.length === 0) {
    console.error('❌ Error fetching quiz questions:', questionsError);
    notFound();
  }

  console.log(`✅ [DB SUCCESS] Loaded ${questions.length} questions from DATABASE for quiz: "${contentItem.title}"`);
  console.log('📊 [DB DATA] First question ID:', questions[0]?.question_id, '| Has hint:', !!questions[0]?.hint, '| Has explanation:', !!questions[0]?.explanation, '| Has image:', !!questions[0]?.image_url);

  // Questions are already in the correct format from the database
  const transformedQuestions = questions.map((q) => ({
    id: q.id,
    section_key: q.section_key,
    question_id: q.question_id,
    question_type: q.question_type as 'multiplechoice' | 'truefalse',
    question_text: q.question_text,
    answers: q.answers as Record<string, string>,
    correct_answer: q.correct_answer,
    points: q.points || 1,
    order_index: q.order_index,
    hint: q.hint || undefined,
    explanation: q.explanation || undefined,
    image_url: q.image_url || undefined,
  }));

  const quizTitle = `${QUIZ_ICONS[slug] || '📝'} ${contentItem.title}`;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header title={quizTitle} showAuth showBackButton userEmail={user.email} isAdmin={userIsAdmin} />
      <div className="flex flex-1">
        {/* Sidebar */}
        <ModuleSidebar />
        
        {/* Main Quiz Content */}
        <div className="flex-1">
          <QuizInterface
            sectionKey={slug}
            sectionTitle={contentItem.title}
            sectionIcon={QUIZ_ICONS[slug] || '📝'}
            questions={transformedQuestions}
            userId={user.id}
            userEmail={user.email}
          />
          <ElevenLabsWidget firstName={profileData?.first_name || undefined} />
        </div>
      </div>
    </div>
  );
}

