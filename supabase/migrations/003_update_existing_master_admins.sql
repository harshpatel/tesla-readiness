-- Update existing users with master admin emails to have master_admin role
UPDATE public.profiles 
SET role = 'master_admin' 
WHERE email IN ('harsh@teslamr.com', 'ricky@teslamr.com');

-- Update existing users with @teslamr.com emails (except master admins) to have admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email LIKE '%@teslamr.com' 
  AND email NOT IN ('harsh@teslamr.com', 'ricky@teslamr.com')
  AND role != 'master_admin';

