import Header from '@/components/Header';
import Link from 'next/link';
import { getCurrentUser, isAdmin } from '@/lib/auth';

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const userIsAdmin = await isAdmin();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Results" showAuth={true} showBackButton={true} userEmail={user?.email} isAdmin={userIsAdmin} />
      
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="quiz-container max-w-3xl w-full p-8">
          {/* Success Header */}
          <div className="text-center mb-8 animate-[fadeIn_0.6s_ease-out]">
            <div className="text-7xl mb-4 animate-[celebrate_0.6s_ease]">🎉</div>
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3">
              Quiz Complete!
            </h1>
            <p className="text-lg text-gray-600">
              Quiz ID: {id}
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Score', value: '--%', emoji: '📊', color: '#0A84FF' },
              { label: 'Questions', value: '0/0', emoji: '📝', color: '#34C759' },
              { label: 'Time', value: '--:--', emoji: '⏱️', color: '#FF9500' }
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
                <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          
          {/* Next Review Section */}
          <div className="mb-8 p-6 rounded-xl" style={{
            background: 'linear-gradient(135deg, #e8f4ff 0%, #f0f8ff 100%)',
            border: '1px solid #0A84FF'
          }}>
            <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 flex items-center gap-2">
              <span>📅</span> Next Review
            </h3>
            <p className="text-gray-700">
              Based on spaced repetition, your next review is scheduled for: <strong>--</strong>
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="flex-1 px-6 py-3 rounded-xl border-2 border-[#0A84FF] text-[#0A84FF] font-semibold transition-all hover:bg-[#0A84FF] hover:text-white text-center"
            >
              ← Back to Dashboard
            </Link>
            <button
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #0A84FF 0%, #0077ED 100%)',
                boxShadow: '0 4px 16px rgba(10, 132, 255, 0.3)'
              }}
            >
              Review Answers →
            </button>
          </div>
          
          {/* Placeholder Message */}
          <div className="mt-8 p-6 rounded-xl text-center" style={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
            border: '1px solid #e0e0e0'
          }}>
            <div className="text-4xl mb-3">📈</div>
            <p className="text-sm text-gray-600">
              Detailed results, performance analytics, and question-by-question breakdown coming soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}



