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
  
  // Fetch quiz progress for all users
  const { data: quizProgress } = await supabase
    .from('user_quiz_progress')
    .select('*');
    
  // Fetch all quiz questions for metrics
  const { data: quizQuestions } = await supabase
    .from('quiz_questions')
    .select('*');
  
  // Calculate summary statistics
  const totalUsers = allUsers?.length || 0;
  const activeUsers = allUsers?.filter(u => {
    const lastActive = u.last_activity_date ? new Date(u.last_activity_date) : null;
    const daysSinceActive = lastActive ? (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24) : 999;
    return daysSinceActive <= 7;
  }).length || 0;
  
  const totalContentItems = contentItems?.length || 0;
  const totalQuizQuestions = quizQuestions?.length || 0;
  
  // Calculate average completion rate
  const usersWithProgress = allUsers?.filter(u => {
    return sectionProgress?.some(sp => sp.user_id === u.id && sp.progress_percent > 0);
  }) || [];
  
  const avgCompletionRate = usersWithProgress.length > 0
    ? Math.round(
        usersWithProgress.reduce((sum, user) => {
          const userSectionProg = sectionProgress?.filter(sp => sp.user_id === user.id) || [];
          const userAvg = userSectionProg.length > 0
            ? userSectionProg.reduce((s, sp) => s + sp.progress_percent, 0) / userSectionProg.length
            : 0;
          return sum + userAvg;
        }, 0) / usersWithProgress.length
      )
    : 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      <Header title="Admin Dashboard" showAuth={true} showBackButton={true} userEmail={user?.email} isAdmin={userIsAdmin} />
      
      <main className="flex-1 p-4 space-y-6">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalUsers}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {allUsers?.filter(u => u.role === 'student').length || 0} students
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users (7d)</div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{activeUsers}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}% of total
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Completion</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{avgCompletionRate}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {usersWithProgress.length} users with progress
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Content Items</div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{totalContentItems}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {modules?.length || 0} modules • {sections?.length || 0} sections
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Quiz Questions</div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">{totalQuizQuestions}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Across all modules
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <a
            href="/admin/quizzes"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all shadow-md hover:shadow-lg"
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
          quizProgress={quizProgress || []}
          quizQuestions={quizQuestions || []}
          error={error}
        />
      </main>
    </div>
  );
}



