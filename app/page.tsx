import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Image from 'next/image';
import LoginForm from '@/components/LoginForm';
import ThemeToggle from '@/components/ThemeToggle';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Complete MRI technologist training curriculum. From fundamentals to clinical readiness—everything you need to launch your career in medical imaging.',
};

export default async function Home() {
  const session = await getSession();
  
  // If logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  // Marketing page with embedded login
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="top-header flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="flex-1" />
        <div className="relative">
          {/* Light mode logo */}
          <Image
            src="/teslamr-logo.png"
            alt="TeslaMR"
            width={192}
            height={48}
            style={{ height: '48px', width: 'auto' }}
            className="block dark:hidden"
            priority
          />
          {/* Dark mode logo */}
          <Image
            src="/teslamr-logo-dark.png"
            alt="TeslaMR"
            width={192}
            height={48}
            style={{ height: '48px', width: 'auto' }}
            className="hidden dark:block"
            priority
          />
        </div>
        <div className="flex-1 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
      
      {/* Hero Section with Login */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text + Login */}
            <div className="text-center lg:text-left space-y-8">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] dark:text-white mb-4 tracking-tight animate-[fadeIn_0.6s_ease-out]">
                  Launch Your<br/>MRI Career
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed animate-[fadeIn_0.6s_ease-out_0.1s_backwards]">
                  Master MRI from physics to patient care. Built by industry experts.
                </p>
                
                {/* Benefits */}
                <div className="grid gap-3 mb-8">
                  {[
                    { emoji: '📝', text: 'Pass your registry exam with confidence' },
                    { emoji: '🏥', text: 'Excel in clinical rotations from day one' },
                    { emoji: '✨', text: 'Become the tech every site wants to hire' }
                  ].map((feature, index) => (
                    <div
                      key={feature.text}
                      className="flex items-center gap-3 text-left"
                      style={{
                        animation: `fadeIn 0.6s ease-out ${0.2 + index * 0.1}s backwards`
                      }}
                    >
                      <span className="text-2xl">{feature.emoji}</span>
                      <span className="text-base text-gray-700 dark:text-gray-300">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Login Form */}
              <div className="animate-[fadeIn_0.6s_ease-out_0.3s_backwards]">
                <LoginForm />
              </div>
            </div>
            
            {/* Right: Hero Image */}
            <div className="animate-[fadeIn_0.6s_ease-out_0.2s_backwards]">
              <Image
                src="/student-at-console.png"
                alt="MRI Technologist at console"
                width={600}
                height={450}
                className="rounded-2xl shadow-xl w-full object-cover"
                style={{ maxHeight: '450px' }}
                priority
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
