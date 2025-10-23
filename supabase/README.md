# TeslaMR Clinical Readiness Check - Database Schema

## Overview

This application uses a spaced repetition system based on the SM-2 algorithm to help students master clinical readiness quizzes through flashcard-style learning.

## Database Tables

### `profiles`
Extends Supabase's built-in `auth.users` table with additional user information.

**Columns:**
- `id` (UUID, PK) - References auth.users(id)
- `email` (TEXT, UNIQUE) - User's email address
- `full_name` (TEXT) - User's full name
- `role` (TEXT) - Either 'student' or 'admin'
- `created_at`, `updated_at` (TIMESTAMP)

### `quizzes`
Stores quiz metadata. Each quiz contains multiple questions/flashcards.

**Columns:**
- `id` (UUID, PK)
- `title` (TEXT) - Quiz title
- `description` (TEXT) - Quiz description
- `category` (TEXT) - Quiz category/topic
- `is_active` (BOOLEAN) - Whether quiz is published
- `created_at`, `updated_at` (TIMESTAMP)

### `questions`
Individual flashcards/questions within a quiz.

**Columns:**
- `id` (UUID, PK)
- `quiz_id` (UUID, FK) - References quizzes(id)
- `question_text` (TEXT) - The question/front of card
- `answer_text` (TEXT) - The answer/back of card
- `explanation` (TEXT) - Additional explanation
- `order_index` (INTEGER) - Display order in quiz
- `created_at`, `updated_at` (TIMESTAMP)

### `student_progress`
Tracks each student's spaced repetition progress per question.

**Columns:**
- `id` (UUID, PK)
- `user_id` (UUID, FK) - References profiles(id)
- `question_id` (UUID, FK) - References questions(id)
- `quiz_id` (UUID, FK) - References quizzes(id)

**Spaced Repetition Fields (SM-2 Algorithm):**
- `repetitions` (INTEGER) - Number of successful reviews
- `ease_factor` (DECIMAL) - Learning difficulty (1.3-2.5+)
- `interval_days` (INTEGER) - Days until next review
- `last_reviewed_at` (TIMESTAMP) - Last review date
- `next_review_at` (TIMESTAMP) - When to review next

**Performance Tracking:**
- `total_reviews` (INTEGER) - Total review attempts
- `correct_reviews` (INTEGER) - Correct review count
- `created_at`, `updated_at` (TIMESTAMP)

**Constraints:**
- UNIQUE(user_id, question_id) - One progress record per user per question

### `review_history`
Logs every review session for analytics and tracking.

**Columns:**
- `id` (UUID, PK)
- `user_id` (UUID, FK) - References profiles(id)
- `question_id` (UUID, FK) - References questions(id)
- `quiz_id` (UUID, FK) - References quizzes(id)
- `quality_rating` (INTEGER) - SM-2 quality rating (0-5)
- `time_spent_seconds` (INTEGER) - Time spent on question
- `was_correct` (BOOLEAN) - Whether answer was correct
- `ease_factor_after` (DECIMAL) - Ease factor after review
- `interval_days_after` (INTEGER) - Interval after review
- `next_review_at` (TIMESTAMP) - Scheduled next review
- `reviewed_at` (TIMESTAMP) - When review occurred

## Spaced Repetition (SM-2 Algorithm)

The system uses the SuperMemo-2 (SM-2) algorithm for optimal review scheduling:

### Quality Ratings (0-5):
- **5** - Perfect response, immediate recall
- **4** - Correct with slight hesitation
- **3** - Correct but difficult
- **2** - Incorrect but remembered
- **1** - Incorrect, seemed familiar
- **0** - Complete blackout

### How It Works:

1. **First Review**: Student sees a new question
2. **Quality Assessment**: System evaluates how well they knew it
3. **Calculate Next Review**: Algorithm determines optimal next review date
4. **Adjust Difficulty**: Ease factor adjusts based on performance

### Review Intervals:
- **Repetition 1**: Review in 1 day
- **Repetition 2**: Review in 6 days
- **Repetition 3+**: Interval = previous interval × ease factor

### If Student Gets It Wrong (quality < 3):
- Reset repetitions to 0
- Start over with 1-day interval
- Ease factor adjusted (but not below 1.3)

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Profiles
- Everyone can view profiles
- Users can only update their own profile

### Quizzes
- Everyone can view active quizzes
- Only admins can create/modify quizzes

### Questions
- Everyone can view questions from active quizzes
- Only admins can modify questions

### Student Progress
- Users can only view/modify their own progress
- Admins can view all progress

### Review History
- Users can only view/insert their own history
- Admins can view all history

## Setup Instructions

### 1. Apply Migration

Run the SQL migration in your Supabase project:

```bash
# Copy the SQL from supabase/migrations/001_initial_schema.sql
# Paste it into Supabase SQL Editor and run
```

Or via Supabase CLI:

```bash
supabase db push
```

### 2. Create Initial Admin User

After a user signs up, update their role:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

### 3. Seed Sample Data (Optional)

```sql
-- Insert a sample quiz
INSERT INTO public.quizzes (title, description, category, is_active)
VALUES (
  'MRI Safety Basics',
  'Essential MRI safety knowledge for clinical staff',
  'Safety',
  true
);

-- Insert sample questions (replace quiz_id with actual UUID)
INSERT INTO public.questions (quiz_id, question_text, answer_text, explanation, order_index)
VALUES
  (
    'YOUR-QUIZ-ID-HERE',
    'What is the main magnetic field strength of a Tesla MR system?',
    '3 Tesla or 1.5 Tesla',
    'Tesla MR systems commonly operate at 1.5T or 3T field strengths.',
    1
  ),
  (
    'YOUR-QUIZ-ID-HERE',
    'Can you bring ferromagnetic objects into the MRI room?',
    'No, never',
    'Ferromagnetic objects can become dangerous projectiles in the magnetic field.',
    2
  );
```

## API Usage Examples

See `lib/types/database.ts` for TypeScript types and `lib/algorithms/spacedRepetition.ts` for the spaced repetition algorithm implementation.

### Example: Record a Review

```typescript
import { supabase } from '@/lib/supabaseClient';
import { calculateNextReview } from '@/lib/algorithms/spacedRepetition';

// Get current progress
const { data: progress } = await supabase
  .from('student_progress')
  .select('*')
  .eq('user_id', userId)
  .eq('question_id', questionId)
  .single();

// Calculate next review based on quality (0-5)
const quality = wasCorrect ? 5 : 0;
const nextReview = calculateNextReview(quality, {
  repetitions: progress.repetitions,
  easeFactor: progress.ease_factor,
  intervalDays: progress.interval_days,
});

// Update progress
await supabase
  .from('student_progress')
  .upsert({
    user_id: userId,
    question_id: questionId,
    quiz_id: quizId,
    repetitions: nextReview.repetitions,
    ease_factor: nextReview.easeFactor,
    interval_days: nextReview.intervalDays,
    next_review_at: nextReview.nextReviewDate.toISOString(),
    last_reviewed_at: new Date().toISOString(),
    total_reviews: (progress?.total_reviews || 0) + 1,
    correct_reviews: (progress?.correct_reviews || 0) + (wasCorrect ? 1 : 0),
  });

// Log review history
await supabase
  .from('review_history')
  .insert({
    user_id: userId,
    question_id: questionId,
    quiz_id: quizId,
    quality_rating: quality,
    was_correct: wasCorrect,
    ease_factor_after: nextReview.easeFactor,
    interval_days_after: nextReview.intervalDays,
    next_review_at: nextReview.nextReviewDate.toISOString(),
  });
```

## Indexes

The following indexes are created for optimal query performance:
- Questions by quiz_id
- Student progress by user_id and question_id
- Next review date for finding due cards
- Review history by user_id and question_id

## Next Steps

1. Apply the migration to your Supabase project
2. Create an admin user
3. (Optional) Seed with sample quiz data
4. Start building out the quiz interface!



