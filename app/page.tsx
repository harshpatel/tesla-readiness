import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const session = await getSession();
  
  // If logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  // Marketing page for non-logged-in users
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="top-header flex items-center justify-between gap-5 px-6 py-4">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="TeslaMR"
            width={192}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </div>
        <Link 
          href="/login"
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #0A84FF 0%, #0077ED 100%)',
            boxShadow: '0 4px 12px rgba(10, 132, 255, 0.3)'
          }}
        >
          Sign In
        </Link>
      </div>
      
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Content */}
          <div className="mb-12 animate-[fadeIn_0.6s_ease-out]">
            <h1 className="text-5xl sm:text-6xl font-bold text-[#1a1a1a] mb-6 tracking-tight">
              TeslaMR Clinical Readiness Checks
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
              Master clinical readiness through intelligent spaced repetition learning
            </p>
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 px-12 py-4 rounded-xl text-lg font-bold text-white transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #0A84FF 0%, #0077ED 100%)',
                boxShadow: '0 4px 16px rgba(10, 132, 255, 0.3)'
              }}
            >
              Get Started
              <span className="text-2xl">→</span>
            </Link>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              {
                emoji: '📚',
                title: 'Smart Learning',
                description: 'Adaptive spaced repetition algorithm optimizes your study schedule'
              },
              {
                emoji: '📊',
                title: 'Track Progress',
                description: 'Monitor your performance and mastery across all clinical areas'
              },
              {
                emoji: '🎯',
                title: 'Clinical Excellence',
                description: 'Focused training for MRI safety and clinical readiness'
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="quiz-container p-8 text-center"
                style={{
                  animation: `fadeIn 0.6s ease-out ${0.2 + index * 0.1}s backwards`
                }}
              >
                <div className="text-5xl mb-4">{feature.emoji}</div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
