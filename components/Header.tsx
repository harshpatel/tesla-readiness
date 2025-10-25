import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import ThemeToggle from '@/components/ThemeToggle';

interface HeaderProps {
  title?: string;
  showAuth?: boolean;
  showBackButton?: boolean;
  userEmail?: string;
  isAdmin?: boolean;
}

export default function Header({ title = 'MRI Technologist Curriculum', showAuth = false, showBackButton = false, userEmail, isAdmin = false }: HeaderProps) {
  return (
    <div className="top-header sticky top-0 z-50 flex items-center justify-between gap-5 px-6 py-4 min-h-[72px]">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {showBackButton && (
          <Link 
            href="/dashboard" 
            className="text-2xl text-[#0A84FF] hover:text-[#0077ED] transition-colors"
            title="Back to Dashboard"
          >
            ←
          </Link>
        )}
        
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          {/* Light mode logo */}
          <Image
            src="/teslamr-logo.svg"
            alt="TeslaMR"
            width={180}
            height={49}
            style={{ height: 'auto', width: 'auto', maxHeight: '49px' }}
            className="dark:hidden"
            priority
          />
          {/* Dark mode logo */}
          <Image
            src="/teslamr-logo-dark.svg"
            alt="TeslaMR"
            width={180}
            height={49}
            style={{ height: 'auto', width: 'auto', maxHeight: '49px' }}
            className="hidden dark:block"
            priority
          />
        </Link>
        
        {title && (
          <div className="text-[22px] font-bold text-[#1a1a1a] dark:text-white leading-tight tracking-tight hidden sm:block">
            {title}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {showAuth && (
          <>
            {isAdmin && (
              <Link 
                href="/admin" 
                className="text-sm font-medium text-[#0A84FF] hover:text-[#0077ED] transition-colors px-3 py-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                Admin Dashboard
              </Link>
            )}
            {userEmail && (
              <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:inline">
                {userEmail}
              </span>
            )}
            <LogoutButton />
          </>
        )}
      </div>
    </div>
  );
}

