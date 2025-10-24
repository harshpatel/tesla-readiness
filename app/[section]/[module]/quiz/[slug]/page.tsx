import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import QuizInterface from '@/components/QuizInterface';
import ElevenLabsWidget from '@/components/ElevenLabsWidget';
import ModuleSidebar from '@/components/ModuleSidebar';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import quizData from '@/public/data/medical-terminology-questions.json';

interface PageProps {
  params: Promise<{
    section: string;
    module: string;
    slug: string;
  }>;
}

// Map of valid quiz slugs from JSON
const VALID_QUIZ_SLUGS = ['prefixes', 'suffixes', 'roots', 'abbreviations', 'positioning'];

// Icon mapping for quiz sections
const QUIZ_ICONS: Record<string, string> = {
  'prefixes': '🔤',
  'suffixes': '📝',
  'roots': '🌿',
  'abbreviations': '📋',
  'positioning': '🧍',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
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
    redirect('/login');
  }

  // Verify valid section, module, and quiz slug
  if (section !== 'phase1' || module !== 'medical-terminology' || !VALID_QUIZ_SLUGS.includes(slug)) {
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

  return (
    <div className="min-h-screen flex flex-col">
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
          <ElevenLabsWidget />
        </div>
      </div>
    </div>
  );
}

