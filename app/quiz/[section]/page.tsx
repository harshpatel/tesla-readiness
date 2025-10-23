import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import QuizInterface from '@/components/QuizInterface';
import quizData from '@/public/data/medical-terminology-questions.json';

const VALID_SECTIONS = ['prefixes', 'suffixes', 'roots', 'abbreviations', 'positioning'];

interface PageProps {
  params: Promise<{ section: string }>;
}

export default async function QuizPage({ params }: PageProps) {
  const { section } = await params;
  
  // Validate section
  if (!VALID_SECTIONS.includes(section)) {
    notFound();
  }

  // Ensure user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  // Get section data from JSON
  const sectionData = quizData.sections[section as keyof typeof quizData.sections];
  
  if (!sectionData) {
    notFound();
  }

  // Transform questions to match our format
  const questions = sectionData.questions.map((q, idx) => ({
    id: `${section}-${idx}`,
    section_key: section,
    question_id: q.id,
    question_type: q.type as 'multiplechoice' | 'truefalse',
    question_text: q.question,
    answers: q.answers,
    correct_answer: q.correctAnswer,
    points: q.points,
    order_index: idx,
  }));

  return (
    <QuizInterface
      sectionKey={section}
      sectionTitle={sectionData.title}
      sectionIcon={
        section === 'prefixes' ? '🔤' :
        section === 'suffixes' ? '📝' :
        section === 'roots' ? '🌿' :
        section === 'abbreviations' ? '📋' :
        '🧍'
      }
      questions={questions}
      userId={user.id}
    />
  );
}

