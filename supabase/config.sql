-- Configure Supabase Auth Settings
-- Run this in your Supabase SQL Editor

-- Enable email provider (should already be enabled by default)
-- This is handled in the Supabase Dashboard under Authentication > Providers

-- Set the site URL (replace with your actual domain in production)
-- This is also configured in the Dashboard under Authentication > URL Configuration

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.quizzes TO authenticated;
GRANT ALL ON public.questions TO authenticated;
GRANT ALL ON public.student_progress TO authenticated;
GRANT ALL ON public.review_history TO authenticated;



