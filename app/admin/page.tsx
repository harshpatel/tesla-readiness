import Header from '@/components/Header';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // Fetch all student profiles
  const { data: students, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Admin Dashboard" showAuth={true} showBackButton={true} />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">
              Student Management
            </h1>
            <p className="text-lg text-gray-600">
              View and manage all student progress
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Students', value: students?.length || 0, emoji: '👥', color: '#0A84FF' },
              { label: 'Active Quizzes', value: '0', emoji: '📚', color: '#34C759' },
              { label: 'Avg. Completion', value: '0%', emoji: '📊', color: '#FF9500' },
              { label: 'Total Questions', value: '0', emoji: '❓', color: '#5856D6' }
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
          
          {/* Students Table */}
          <div className="quiz-container p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#1a1a1a]">All Students</h2>
            </div>
            
            {error && (
              <div className="p-6 text-red-600">
                Error loading students: {error.message}
              </div>
            )}
            
            {!error && (!students || students.length === 0) ? (
              <div className="p-12 text-center">
                <div className="text-5xl mb-4">👥</div>
                <p className="text-gray-600">No students registered yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Progress
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students?.map((student) => (
                      <tr 
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                              {student.full_name?.charAt(0) || student.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-[#1a1a1a]">
                                {student.full_name || 'Anonymous'}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {student.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(student.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                              <div 
                                className="h-full rounded-full"
                                style={{
                                  width: '0%',
                                  background: 'linear-gradient(135deg, #0A84FF 0%, #0077ED 100%)'
                                }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-gray-600">
                              0%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="px-4 py-2 text-sm font-medium text-[#0A84FF] hover:text-[#0077ED] transition-colors">
                            View Details →
                          </button>
                        </td>
                      </tr>
                    ))}
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



