'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ImpersonationBannerProps {
  impersonatedUserName: string;
  impersonatedUserEmail: string;
}

export default function ImpersonationBanner({ 
  impersonatedUserName, 
  impersonatedUserEmail 
}: ImpersonationBannerProps) {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleExitImpersonation = async () => {
    if (isExiting) return;
    
    setIsExiting(true);
    
    try {
      const response = await fetch('/api/admin/exit-impersonation', {
        method: 'POST',
      });

      if (response.ok) {
        // Redirect to admin page after exiting
        router.push('/admin');
        router.refresh();
      } else {
        console.error('Failed to exit impersonation');
        setIsExiting(false);
      }
    } catch (error) {
      console.error('Error exiting impersonation:', error);
      setIsExiting(false);
    }
  };

  return (
    <div className="bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-white px-4 py-2 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚠️</span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="font-semibold">Viewing as:</span>
          <span className="font-bold">{impersonatedUserName}</span>
          <span className="text-sm opacity-75">({impersonatedUserEmail})</span>
        </div>
      </div>
      <button
        onClick={handleExitImpersonation}
        disabled={isExiting}
        className="px-4 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {isExiting ? 'Exiting...' : 'Exit View'}
      </button>
    </div>
  );
}

