import LoginForm from '@/components/LoginForm';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="top-header flex items-center justify-between gap-5 px-6 py-4">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="TeslaMR"
            width={192}
            height={48}
            style={{ height: '48px', width: 'auto' }}
            priority
          />
        </Link>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center animate-[fadeIn_0.6s_ease-out]">
            <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">
              Clinical Readiness Checks
            </h1>
            <p className="text-lg text-gray-600">
              Sign in to continue your training
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

