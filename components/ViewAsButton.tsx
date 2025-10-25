'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ViewAsButtonProps {
  userId: string;
  userName: string;
  isStudent: boolean;
}

export default function ViewAsButton({ userId, userName, isStudent }: ViewAsButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!isStudent) {
    return null;
  }

  const handleViewAs = async () => {
    if (isLoading) return;

    const confirmed = window.confirm(
      `View as ${userName}?\n\nYou will see exactly what this student sees. This is read-only mode - you cannot make changes on their behalf.`
    );

    if (!confirmed) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        // Redirect to dashboard as the student
        router.push('/dashboard');
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Failed to start impersonation: ${error.error || 'Unknown error'}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error starting impersonation:', error);
      alert('An error occurred while trying to view as this user');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleViewAs}
      disabled={isLoading}
      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      <span>👁️</span>
      <span>{isLoading ? 'Loading...' : 'View As Student'}</span>
    </button>
  );
}

