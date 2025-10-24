import Header from '@/components/Header';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import ClickableUserRow from '@/components/ClickableUserRow';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage users and monitor quiz progress across the TeslaMR platform.',
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/');
  }
  
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

  // Check if user has admin or masteradmin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const userRole = profile?.role || 'student';
  
  if (userRole !== 'admin' && userRole !== 'master_admin') {
    redirect('/dashboard');
  }
  
  // Fetch ALL user profiles (students, admins, master admins)
  const { data: allUsers, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Fetch progress for all users
  const { data: allProgress } = await supabase
    .from('user_section_progress')
    .select('*');
  
  // Calculate total questions across all sections
  const { data: allQuestions } = await supabase
    .from('quiz_questions')
    .select('id', { count: 'exact', head: true });
  
  const totalQuestions = allQuestions?.length || 88; // Fallback to known count
  
  // Map progress to users
  const usersWithProgress = allUsers?.map(user => {
    const userProgress = allProgress?.filter(p => p.user_id === user.id) || [];
    const totalMastered = userProgress.reduce((sum, p) => sum + p.mastered_questions, 0);
    const progressPercentage = totalQuestions > 0 ? Math.round((totalMastered / totalQuestions) * 100) : 0;
    
    return {
      ...user,
      totalMastered,
      progressPercentage,
    };
  }) || [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Admin Dashboard" showAuth={true} showBackButton={true} userEmail={user?.email} />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">
              User Progress Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              View progress for all users (students, admins, and master admins)
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: usersWithProgress?.length || 0, emoji: '👥', color: '#0A84FF' },
              { label: 'Students', value: usersWithProgress?.filter(u => u.role === 'student').length || 0, emoji: '👨‍🎓', color: '#34C759' },
              { label: 'Avg. Progress', value: `${Math.round(usersWithProgress.reduce((sum, u) => sum + u.progressPercentage, 0) / (usersWithProgress.length || 1))}%`, emoji: '📊', color: '#FF9500' },
              { label: 'Total Questions', value: totalQuestions, emoji: '❓', color: '#5856D6' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="p-6 rounded-xl border border-gray-200 bg-white"
                style={{
                  animation: `fadeIn 0.6s ease-out ${0.1 + index * 0.05}s backwards`
                }}
              >
                <div className="text-2xl mb-2">{stat.emoji}</div>
                <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Users Table */}
          <div className="quiz-container p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#1a1a1a]">All Users</h2>
            </div>
            
            {error && (
              <div className="p-6 text-red-600">
                Error loading users: {error.message}
              </div>
            )}
            
            {!error && (!usersWithProgress || usersWithProgress.length === 0) ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">👥</div>
                <p className="text-gray-600">No users registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Progress
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Questions Mastered
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {usersWithProgress?.map((userWithProgress) => {
                      // Determine badge color based on role
                      const roleColors = {
                        master_admin: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Master Admin' },
                        admin: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Admin' },
                        student: { bg: 'bg-green-100', text: 'text-green-800', label: 'Student' },
                      };
                      const roleStyle = roleColors[userWithProgress.role as keyof typeof roleColors];
                      
                      return (
                        <ClickableUserRow
                          key={userWithProgress.id}
                          userId={userWithProgress.id}
                          fullName={userWithProgress.full_name}
                          email={userWithProgress.email}
                          role={roleStyle}
                          createdAt={userWithProgress.created_at}
                          progressPercentage={userWithProgress.progressPercentage}
                          totalMastered={userWithProgress.totalMastered}
                          totalQuestions={totalQuestions}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}



