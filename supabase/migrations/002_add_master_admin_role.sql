-- Add master_admin role to profiles table
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('student', 'admin', 'master_admin'));

-- Update RLS policies to include master_admin permissions

-- Master admins can update any profile
CREATE POLICY "Master admins can update any profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'master_admin'
  ));

-- Master admins can view all data (already covered by existing SELECT policies)

-- Update quiz policies to include master_admin
DROP POLICY IF EXISTS "Active quizzes are viewable by everyone" ON public.quizzes;
CREATE POLICY "Active quizzes are viewable by everyone" 
  ON public.quizzes FOR SELECT 
  USING (is_active = true OR auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'master_admin')
  ));

DROP POLICY IF EXISTS "Only admins can insert quizzes" ON public.quizzes;
CREATE POLICY "Only admins can insert quizzes" 
  ON public.quizzes FOR INSERT 
  WITH CHECK (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'master_admin')
  ));

DROP POLICY IF EXISTS "Only admins can update quizzes" ON public.quizzes;
CREATE POLICY "Only admins can update quizzes" 
  ON public.quizzes FOR UPDATE 
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'master_admin')
  ));

-- Update question policies
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON public.questions;
CREATE POLICY "Questions are viewable by everyone" 
  ON public.questions FOR SELECT 
  USING (quiz_id IN (
    SELECT id FROM public.quizzes WHERE is_active = true
  ) OR auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'master_admin')
  ));

-- Update student progress policies
DROP POLICY IF EXISTS "Users can view own progress" ON public.student_progress;
CREATE POLICY "Users can view own progress" 
  ON public.student_progress FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'master_admin')
  ));

-- Update review history policies
DROP POLICY IF EXISTS "Users can view own review history" ON public.review_history;
CREATE POLICY "Users can view own review history" 
  ON public.review_history FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'master_admin')
  ));

