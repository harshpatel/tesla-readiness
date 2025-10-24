-- Unlock MRI Procedures & Set Up I: Neuro module
UPDATE modules
SET is_locked = false
WHERE slug = 'mri-procedures-neuro'
  AND section_id = (SELECT id FROM sections WHERE slug = 'phase1');

