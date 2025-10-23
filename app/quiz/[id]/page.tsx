import Header from '@/components/Header';

export default function QuizPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Quiz" showAuth={true} showBackButton={true} />
      
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="quiz-container max-w-3xl w-full p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Progress
              </span>
              <span className="text-sm font-semibold text-[#1a1a1a]">
                0 / 0
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: '0%',
                  background: 'linear-gradient(135deg, #0A84FF 0%, #0077ED 100%)',
                  boxShadow: '0 0 8px rgba(10, 132, 255, 0.3)'
                }}
              />
            </div>
          </div>
          
          {/* Question Card */}
          <div className="mb-8 animate-[fadeIn_0.6s_ease-out]">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded bg-blue-50 text-[#0A84FF] text-xs font-semibold uppercase tracking-wide mb-4">
                Quiz ID: {params.id}
              </span>
              <h2 className="text-2xl font-semibold text-[#1a1a1a] leading-snug">
                Question will appear here
              </h2>
            </div>
            
            {/* Answer Options Placeholder */}
            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((letter, index) => (
                <div
                  key={letter}
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-[#0A84FF] hover:bg-blue-50 hover:translate-x-1"
                  style={{
                    animation: `fadeIn 0.4s ease-out ${0.1 + index * 0.05}s backwards`
                  }}
                >
                  <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center font-semibold text-sm text-gray-600 flex-shrink-0">
                    {letter}
                  </div>
                  <div className="text-[15px] text-[#1a1a1a]">
                    Answer option {letter} placeholder
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              className="flex-1 px-6 py-3 rounded-xl border-2 border-[#0A84FF] text-[#0A84FF] font-semibold transition-all hover:bg-[#0A84FF] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              ← Previous
            </button>
            <button
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #0A84FF 0%, #0077ED 100%)',
                boxShadow: '0 4px 16px rgba(10, 132, 255, 0.3)'
              }}
              disabled
            >
              Next →
            </button>
          </div>
          
          {/* Placeholder Message */}
          <div className="mt-8 p-6 rounded-xl text-center" style={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
            border: '1px solid #e0e0e0'
          }}>
            <div className="text-4xl mb-3">📝</div>
            <p className="text-sm text-gray-600">
              Quiz interface coming soon. This will display flashcard-style questions with spaced repetition tracking.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}



