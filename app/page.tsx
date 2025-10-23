import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Image from 'next/image';
import LoginForm from '@/components/LoginForm';

export default async function Home() {
  const session = await getSession();
  
  // If logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }
  
  // Marketing page with embedded login
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="top-header flex items-center justify-center gap-5 px-6 py-4">
        <Image
          src="/logo.png"
          alt="TeslaMR"
          width={192}
          height={48}
          style={{ height: '48px', width: 'auto' }}
          priority
        />
      </div>
      
      {/* Hero Section with Login */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text + Login */}
            <div className="text-center lg:text-left space-y-8">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-4 tracking-tight animate-[fadeIn_0.6s_ease-out]">
                  Show Up Ready.<br/>Sound Like a Pro.
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed animate-[fadeIn_0.6s_ease-out_0.1s_backwards]">
                  Master medical terminology before your first clinical day
                </p>
                
                {/* Benefits */}
                <div className="grid gap-3 mb-8">
                  {[
                    { emoji: '💪', text: 'Feel confident when you show up on site' },
                    { emoji: '⭐', text: 'Impress your clinical mentor' },
                    { emoji: '🚀', text: 'Get so good they offer you a job' }
                  ].map((feature, index) => (
                    <div
                      key={feature.text}
                      className="flex items-center gap-3 text-left"
                      style={{
                        animation: `fadeIn 0.6s ease-out ${0.2 + index * 0.1}s backwards`
                      }}
                    >
                      <span className="text-2xl">{feature.emoji}</span>
                      <span className="text-base text-gray-700">{feature.text}</span>
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
