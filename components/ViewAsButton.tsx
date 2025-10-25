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
  const [showModal, setShowModal] = useState(false);

  if (!isStudent) {
    return null;
  }

  const handleConfirm = async () => {
    if (isLoading) return;

    setShowModal(false);
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
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isLoading}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span>👁️</span>
        <span>{isLoading ? 'Loading...' : 'View As Student'}</span>
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 px-6 py-5">
              <h2 className="text-2xl font-bold text-white">localhost:3000 says</h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                View as {userName}?
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                You will see exactly what this student sees. This is read-only mode - you cannot make changes on their behalf.
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-500 dark:hover:to-purple-500 transition-all shadow-md hover:shadow-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

