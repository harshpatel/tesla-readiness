-- Add user_module_overrides table for admin unlocking
CREATE TABLE IF NOT EXISTS public.user_module_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  is_unlocked BOOLEAN DEFAULT true,
  unlocked_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_module_overrides_user_module 
  ON public.user_module_overrides(user_id, module_id);

-- Enable RLS
ALTER TABLE public.user_module_overrides ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own overrides"
  ON public.user_module_overrides
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all overrides"
  ON public.user_module_overrides
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'master_admin')
    )
  );

CREATE POLICY "Admins can insert overrides"
  ON public.user_module_overrides
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'master_admin')
    )
  );

CREATE POLICY "Admins can update overrides"
  ON public.user_module_overrides
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'master_admin')
    )
  );

CREATE POLICY "Admins can delete overrides"
  ON public.user_module_overrides
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'master_admin')
    )
  );

-- Add comment
COMMENT ON TABLE public.user_module_overrides IS 'Admin overrides for module access - allows unlocking modules for specific students';

