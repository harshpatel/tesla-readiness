import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

interface HeaderProps {
  title?: string;
  showAuth?: boolean;
  showBackButton?: boolean;
  userEmail?: string;
}

export default function Header({ title = 'MRI Technologist Curriculum', showAuth = false, showBackButton = false, userEmail }: HeaderProps) {
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
          <Image
            src="/logo.png"
            alt="TeslaMR"
            width={144}
            height={36}
            style={{ height: 'auto', width: 'auto', maxHeight: '36px' }}
            priority
          />
        </Link>
        
        {title && (
          <div className="text-[22px] font-bold text-[#1a1a1a] leading-tight tracking-tight hidden sm:block">
            {title}
          </div>
        )}
      </div>
      
      {showAuth && (
        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="text-sm text-slate-600 hidden sm:inline">
              {userEmail}
            </span>
          )}
          <LogoutButton />
        </div>
      )}
    </div>
  );
}

