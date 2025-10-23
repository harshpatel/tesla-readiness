# Authentication Setup Guide

## ✅ What's Configured

Your Next.js app now has **magic link email authentication** powered by Supabase!

### Files Created:

1. **`middleware.ts`** - Protects routes, refreshes sessions
2. **`app/auth/callback/route.ts`** - Handles magic link callback
3. **`app/api/auth/logout/route.ts`** - Logout endpoint
4. **`lib/auth.ts`** - Server-side auth helpers
5. **`components/LoginForm.tsx`** - Beautiful login form with magic link
6. **`app/login/page.tsx`** - Login page

## 🔧 Final Supabase Configuration Steps

### 1. Enable Email Provider (if not already enabled)

1. Go to: https://supabase.com/dashboard/project/cffhrzzfhyotkbuuoayc/auth/providers
2. Find "Email" provider
3. Make sure it's **enabled**
4. Enable "Confirm email" if you want email verification (optional)

### 2. Configure Site URL & Redirect URLs

1. Go to: https://supabase.com/dashboard/project/cffhrzzfhyotkbuuoayc/auth/url-configuration
2. Set **Site URL** to:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback` (for production)

### 3. Customize Email Template (Optional)

1. Go to: https://supabase.com/dashboard/project/cffhrzzfhyotkbuuoayc/auth/templates
2. Edit the "Magic Link" template
3. Customize the email design and copy

## 🧪 Test the Authentication

### 1. Start the dev server (if not running):
```bash
npm run dev
```

### 2. Visit the login page:
```
http://localhost:3000/login
```

### 3. Enter your email and click "Send magic link"

### 4. Check your email inbox for the magic link

### 5. Click the link - you should be:
- Redirected to `/dashboard`
- Automatically have a profile created in the `profiles` table
- Have an active session

## 🔐 How It Works

### Magic Link Flow:

1. **User enters email** on `/login`
2. **Supabase sends magic link** to their email
3. **User clicks link** → redirected to `/auth/callback?code=...`
4. **App exchanges code** for session
5. **Trigger creates profile** automatically (if new user)
6. **User redirected** to `/dashboard`

### Protected Routes:

These routes require authentication (configured in `middleware.ts`):
- `/dashboard` - Student quiz list
- `/quiz/*` - Quiz taking interface
- `/results/*` - Quiz results
- `/admin` - Admin panel

If a user tries to access these without being logged in, they're redirected to `/login`.

## 📝 Using Auth in Your Code

### Server Components (App Router):

```typescript
import { getCurrentUser, requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  // Get current user (returns null if not authenticated)
  const user = await getCurrentUser();
  
  // Or require authentication (throws error if not authenticated)
  const session = await requireAuth();
  
  return <div>Welcome, {user?.email}</div>;
}
```

### Client Components:

```typescript
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function MyComponent() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);
  
  return <div>User: {user?.email}</div>;
}
```

### Logout:

```typescript
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

## 🎨 Styling

The login page uses:
- Tailwind CSS for styling
- Shadcn/UI components (Button, Input, Card)
- Gradient background
- Loading states
- Success/error messages

## 🔒 Security Features

✅ **Row Level Security (RLS)** - Already configured in database
✅ **Automatic profile creation** - Trigger creates profile on signup
✅ **Session refresh** - Middleware refreshes expired sessions
✅ **Protected routes** - Middleware blocks unauthorized access
✅ **Server-side auth** - Session validated on server

## 🚀 Production Checklist

Before deploying to production:

- [ ] Update Site URL in Supabase to production domain
- [ ] Add production redirect URL to Supabase
- [ ] Customize email templates with your branding
- [ ] Test magic link flow end-to-end
- [ ] Set up custom domain for emails (optional)
- [ ] Enable email rate limiting (Supabase setting)
- [ ] Set up monitoring for failed auth attempts

## 📧 Email Configuration (Optional)

By default, Supabase uses their email service. For production:

1. Go to: https://supabase.com/dashboard/project/cffhrzzfhyotkbuuoayc/settings/auth
2. Configure custom SMTP (optional)
3. Use services like SendGrid, AWS SES, or Resend

## 🎓 Creating Admin Users

After a user signs up, you can promote them to admin:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

Or use the helper in your code:

```typescript
import { requireAdmin } from '@/lib/auth';

export default async function AdminPage() {
  const admin = await requireAdmin(); // Throws if not admin
  return <div>Admin Panel</div>;
}
```

---

Happy authenticating! 🔐



