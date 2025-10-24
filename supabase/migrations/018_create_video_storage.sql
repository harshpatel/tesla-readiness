-- Create a storage bucket for videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to read videos
CREATE POLICY "Authenticated users can view videos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'videos');

-- Allow admins and master_admins to upload videos
CREATE POLICY "Admins can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos' 
  AND auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'master_admin')
  )
);

-- Allow admins and master_admins to update videos
CREATE POLICY "Admins can update videos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'videos' 
  AND auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'master_admin')
  )
);

-- Allow admins and master_admins to delete videos
CREATE POLICY "Admins can delete videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'videos' 
  AND auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('admin', 'master_admin')
  )
);

