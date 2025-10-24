import Header from '@/components/Header';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import AdminTable from '@/components/AdminTable';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage users and monitor progress across the TeslaMR platform.',
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/');
  }

  const userIsAdmin = await isAdmin();
  
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

  // Check if user has admin or master_admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const userRole = profile?.role || 'student';
  
  if (userRole !== 'admin' && userRole !== 'master_admin') {
    redirect('/dashboard');
  }
  
  // Fetch ALL user profiles with all fields
  const { data: allUsers, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Fetch all sections and modules for structure
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
  
  // Fetch module progress for all users
  const { data: moduleProgress } = await supabase
    .from('user_module_progress')
    .select('*');
  
  // Fetch content progress for all users
  const { data: contentProgress } = await supabase
    .from('user_content_progress')
    .select('*');
  
  // Fetch section progress for all users
  const { data: sectionProgress } = await supabase
    .from('user_section_progress')
    .select('*');
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Admin Dashboard" showAuth={true} showBackButton={true} userEmail={user?.email} isAdmin={userIsAdmin} />
      
      <main className="flex-1 p-4">
        {/* Quick Actions */}
        <div className="mb-6 flex gap-4">
          <a
            href="/admin/quizzes"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            📝 View Quiz Data (Source of Truth)
          </a>
        </div>

        <AdminTable
          users={allUsers || []}
          sections={sections || []}
          modules={modules || []}
          contentItems={contentItems || []}
          moduleProgress={moduleProgress || []}
          contentProgress={contentProgress || []}
          sectionProgress={sectionProgress || []}
          error={error}
        />
      </main>
    </div>
  );
}



