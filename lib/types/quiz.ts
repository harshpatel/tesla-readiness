export interface QuizQuestion {
  id: string;
  section_key: string;
  question_id: string;
  question_type: 'multiplechoice' | 'truefalse';
  question_text: string;
  answers: Record<string, string>; // { "A": "Answer 1", "B": "Answer 2", ... }
  correct_answer: string;
  points: number;
  order_index: number;
}

export interface UserQuizProgress {
  id: string;
  user_id: string;
  question_id: string;
  section_key: string;
  easiness_factor: number;
  repetitions: number;
  interval_days: number;
  next_review_date: string;
  correct_attempts: number;
  incorrect_attempts: number;
  mastered: boolean;
  last_attempt_date: string | null;
}

export interface QuizAttempt {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  isFirstAttempt: boolean;
  timeSpent: number;
}

export interface QuizSessionState {
  sectionKey: string;
  questionQueue: QuizQuestion[];
  currentQuestionIndex: number;
  masteredQuestions: Set<string>;
  attempts: QuizAttempt[];
}

