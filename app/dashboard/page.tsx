import Header from '@/components/Header';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Clinical Readiness Checks" showAuth={true} userEmail={user?.email} />
      
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="quiz-container max-w-4xl w-full p-8">
          {/* Welcome Section */}
          <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">
              Welcome back{user?.full_name ? `, ${user.full_name}` : ''}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Ready to continue your clinical readiness training?
            </p>
          </div>
          
          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Quizzes Available', value: '0', emoji: '📚' },
              { label: 'Questions Mastered', value: '0', emoji: '✓' },
              { label: 'Study Streak', value: '0 days', emoji: '🔥' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="p-6 rounded-xl border border-gray-200 text-center"
                style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                  animation: `fadeIn 0.6s ease-out ${0.2 + index * 0.1}s backwards`
                }}
              >
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className="text-2xl font-bold text-[#1a1a1a] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Placeholder Content */}
          <div className="text-center py-12 px-4 rounded-xl border border-gray-200" style={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
          }}>
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-3">
              Coming Soon
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Your personalized quiz dashboard will appear here. You'll be able to see available quizzes, track your progress, and continue where you left off.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}



