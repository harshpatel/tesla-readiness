import { notFound, redirect } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import QuizInterface from '@/components/QuizInterface';
import ElevenLabsWidget from '@/components/ElevenLabsWidget';
import ModuleSidebar from '@/components/ModuleSidebar';
import Header from '@/components/Header';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import medicalTerminologyQuizData from '@/public/data/medical-terminology-questions.json';
import introToMriQuizData from '@/public/data/introduction-to-mri-questions.json';
import generalAnatomyPhysiologyQuizData from '@/public/data/general-anatomy-physiology-questions.json';

interface PageProps {
  params: Promise<{
    section: string;
    module: string;
    slug: string;
  }>;
}

// Map module slugs to their quiz data files
const QUIZ_DATA_MAP: Record<string, any> = {
  'medical-terminology': medicalTerminologyQuizData,
  'introduction-to-mri': introToMriQuizData,
  'general-anatomy-physiology': generalAnatomyPhysiologyQuizData,
};

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
  
  // Get the appropriate quiz data based on module
  const quizData = QUIZ_DATA_MAP[module];
  if (!quizData) {
    return { title: 'Quiz Not Found' };
  }
  
  // Get quiz data from JSON
  const sectionData = quizData.sections[slug as keyof typeof quizData.sections];
  
  if (!sectionData) {
    return { title: 'Quiz Not Found' };
  }

  return {
    title: `${sectionData.title} Quiz`,
    description: sectionData.description || `Master ${sectionData.title.toLowerCase()} with interactive quizzes.`,
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

  // Get the appropriate quiz data based on module
  const quizData = QUIZ_DATA_MAP[module];
  if (!quizData) {
    notFound();
  }

  // Get quiz data from JSON file
  const sectionData = quizData.sections[slug as keyof typeof quizData.sections];
  
  if (!sectionData) {
    notFound();
  }

  // Transform questions from JSON to match our format
  const transformedQuestions = sectionData.questions.map((q: any, idx: number) => ({
    id: q.id,
    section_key: slug,
    question_id: q.id,
    question_type: q.type as 'multiplechoice' | 'truefalse',
    question_text: q.question,
    answers: q.answers as Record<string, string>,
    correct_answer: q.correctAnswer,
    points: q.points || 1,
    order_index: idx,
    hint: q.hint,
    explanation: q.explanation,
  }));

  const quizTitle = `${QUIZ_ICONS[slug] || '📝'} ${sectionData.title}`;
  
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
            sectionTitle={sectionData.title}
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

