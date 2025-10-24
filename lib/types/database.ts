export type UserRole = 'student' | 'admin' | 'masteradmin';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  answer_text: string;
  explanation?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface StudentProgress {
  id: string;
  user_id: string;
  question_id: string;
  quiz_id: string;
  
  // Spaced repetition fields
  repetitions: number;
  ease_factor: number;
  interval_days: number;
  last_reviewed_at?: string;
  next_review_at: string;
  
  // Performance tracking
  total_reviews: number;
  correct_reviews: number;
  
  created_at: string;
  updated_at: string;
}

export interface ReviewHistory {
  id: string;
  user_id: string;
  question_id: string;
  quiz_id: string;
  
  // Review data
  quality_rating: number; // 0-5 (SM-2 scale)
  time_spent_seconds?: number;
  was_correct: boolean;
  
  // Snapshot of spaced repetition state
  ease_factor_after?: number;
  interval_days_after?: number;
  next_review_at?: string;
  
  reviewed_at: string;
}

// Extended types with relations
export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

export interface QuestionWithProgress extends Question {
  progress?: StudentProgress;
}

export interface QuizProgress {
  quiz: Quiz;
  total_questions: number;
  completed_questions: number;
  accuracy: number;
  next_review_date?: string;
}



