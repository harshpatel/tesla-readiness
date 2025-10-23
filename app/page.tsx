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
  
  // Clean login page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="TeslaMR"
          width={192}
          height={48}
          className="h-12 w-auto"
          priority
        />
      </div>
      
      {/* Login Form */}
      <LoginForm />
    </div>
  );
}
