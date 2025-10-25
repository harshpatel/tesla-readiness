import Header from '@/components/Header';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCurrentUser, requireAdmin, isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserDetailView from '@/components/UserDetailView';

interface UserDetailPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  // Require admin access
  await requireAdmin();
  
  const currentUser = await getCurrentUser();
  const userIsAdmin = await isAdmin();
  const { userId } = await params;
  
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
  
  // Fetch user profile
  const { data: userProfile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (profileError || !userProfile) {
    redirect('/admin');
  }
  
  // Fetch all sections and modules
  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .order('order_index');
    
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .order('order_index');
  
  // Fetch all content items
  const { data: contentItems } = await supabase
    .from('content_items')
    .select('*')
    .order('order_index');
  
  // Fetch progress data for this user
  const { data: moduleProgress } = await supabase
    .from('user_module_progress')
    .select('*')
    .eq('user_id', userId);
  
  const { data: contentProgress } = await supabase
    .from('user_content_progress')
    .select('*')
    .eq('user_id', userId);
  
  const { data: sectionProgress } = await supabase
    .from('user_section_progress')
    .select('*')
    .eq('user_id', userId);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header 
        title="User Details" 
        showAuth={true} 
        showBackButton={true} 
        userEmail={currentUser?.email}
        isAdmin={userIsAdmin}
      />
      
      <main className="flex-1 p-4">
        <UserDetailView
          userProfile={userProfile}
          sections={sections || []}
          modules={modules || []}
          contentItems={contentItems || []}
          moduleProgress={moduleProgress || []}
          contentProgress={contentProgress || []}
          sectionProgress={sectionProgress || []}
        />
      </main>
    </div>
  );
}

