-- Update the Introduction to MRI video to use Supabase Storage URL
UPDATE public.content_items
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{videoUrl}',
  '"https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/Introduction%20to%20MRI.mp4"'::jsonb
)
WHERE slug = 'introduction'
AND type = 'video'
AND module_id = (
  SELECT id FROM public.modules WHERE slug = 'introduction-to-mri'
);

