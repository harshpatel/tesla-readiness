# TeslaMR Clinical Readiness Check - Setup Guide

## 🎯 What You Have Now

A complete spaced repetition learning system for clinical readiness quizzes!

## 📁 Project Structure

```
/app
  ├── page.tsx              # Home page
  ├── login/                # Authentication
  ├── dashboard/            # Student quiz list
  ├── quiz/[id]/            # Quiz taking interface
  ├── results/[id]/         # Quiz results
  └── admin/                # Admin dashboard

/lib
  ├── supabaseClient.ts     # Supabase connection
  ├── types/
  │   └── database.ts       # TypeScript types
  └── algorithms/
      └── spacedRepetition.ts  # SM-2 algorithm

/supabase
  └── migrations/
      └── 001_initial_schema.sql  # Database schema
```

## 🚀 Next Steps

### 1. Apply Database Migration

Go to your Supabase Dashboard:
1. Navigate to: https://supabase.com/dashboard/project/cffhrzzfhyotkbuuoayc
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste and click "Run"

### 2. Enable Authentication

In your Supabase Dashboard:
1. Go to "Authentication" → "Providers"
2. Enable Email auth (or any provider you want)
3. Configure email templates if needed

### 3. Create Your First Admin User

After signing up a user, run this in SQL Editor:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### 4. (Optional) Seed Sample Data

```sql
-- Insert a sample quiz
INSERT INTO public.quizzes (title, description, category, is_active)
VALUES (
  'MRI Safety Basics',
  'Essential MRI safety knowledge',
  'Safety',
  true
)
RETURNING id;

-- Copy the returned ID and use it below
INSERT INTO public.questions (quiz_id, question_text, answer_text, explanation, order_index)
VALUES
  (
    'PASTE-QUIZ-ID-HERE',
    'What is the main magnetic field strength of a Tesla MR system?',
    '3 Tesla or 1.5 Tesla',
    'Tesla MR systems commonly operate at 1.5T or 3T field strengths.',
    1
  ),
  (
    'PASTE-QUIZ-ID-HERE',
    'Can you bring ferromagnetic objects into the MRI room?',
    'No, never',
    'Ferromagnetic objects can become projectiles in the magnetic field.',
    2
  );
```

## 🎓 How The System Works

### Spaced Repetition (SM-2 Algorithm)

1. **Student sees a question** for the first time
2. **They answer** (correct/incorrect)
3. **System calculates** next review date based on:
   - How well they knew it (quality 0-5)
   - Their past performance (ease factor)
   - Number of successful reviews (repetitions)
4. **Question reappears** at optimal time for memory retention

### Review Schedule Example:
- ✅ Got it right → Review in 1 day
- ✅ Got it right → Review in 6 days
- ✅ Got it right → Review in 15 days (6 × 2.5 ease factor)
- ❌ Got it wrong → Back to 1 day

### Quality Ratings:
- **5** - Perfect, instant recall
- **4** - Correct with slight hesitation
- **3** - Correct but difficult
- **2** - Incorrect but remembered
- **1** - Incorrect, seemed familiar
- **0** - Complete blackout

## 📊 Database Tables

- **profiles** - User accounts (student/admin)
- **quizzes** - Quiz metadata
- **questions** - Flashcards within quizzes
- **student_progress** - Tracks each student's progress per question
- **review_history** - Logs every review session

See `supabase/README.md` for detailed schema documentation.

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Test Supabase connection
# Visit: http://localhost:3000/api/test-supabase
```

## 🌐 Deploy to Render

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run start
```

**Environment Variables on Render:**
```
NEXT_PUBLIC_SUPABASE_URL=https://cffhrzzfhyotkbuuoayc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 📝 Building Features

### Example: Get Due Questions for a User

```typescript
import { supabase } from '@/lib/supabaseClient';

const { data: dueQuestions } = await supabase
  .from('student_progress')
  .select(`
    *,
    questions (*)
  `)
  .eq('user_id', userId)
  .lte('next_review_at', new Date().toISOString())
  .order('next_review_at', { ascending: true });
```

### Example: Record a Review

```typescript
import { calculateNextReview } from '@/lib/algorithms/spacedRepetition';

// Get current progress
const { data: progress } = await supabase
  .from('student_progress')
  .select('*')
  .eq('user_id', userId)
  .eq('question_id', questionId)
  .single();

// Calculate next review
const quality = wasCorrect ? 5 : 0;
const nextReview = calculateNextReview(quality, {
  repetitions: progress?.repetitions || 0,
  easeFactor: progress?.ease_factor || 2.5,
  intervalDays: progress?.interval_days || 0,
});

// Update progress
await supabase.from('student_progress').upsert({
  user_id: userId,
  question_id: questionId,
  quiz_id: quizId,
  ...nextReview,
  next_review_at: nextReview.nextReviewDate.toISOString(),
  last_reviewed_at: new Date().toISOString(),
  total_reviews: (progress?.total_reviews || 0) + 1,
  correct_reviews: (progress?.correct_reviews || 0) + (wasCorrect ? 1 : 0),
});
```

## 🎨 Next: Build the UI

Now you're ready to:
1. ✅ Build the login page (Supabase Auth)
2. ✅ Build the dashboard (list quizzes, show progress)
3. ✅ Build the quiz interface (flashcard view)
4. ✅ Build the results page (show performance)
5. ✅ Build the admin panel (view all progress)

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Shadcn/UI Components](https://ui.shadcn.com/)
- [SM-2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)

## 🤝 Need Help?

Check the detailed documentation in:
- `supabase/README.md` - Database schema details
- `lib/types/database.ts` - TypeScript types
- `lib/algorithms/spacedRepetition.ts` - Algorithm implementation

---

Happy coding! 🚀



