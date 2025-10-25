'use client';

import { useRouter } from 'next/navigation';
import { MODULE_COMPLETION_THRESHOLD } from '@/lib/constants';

interface LockedModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
  previousModuleRequired?: {
    id: string;
    title: string;
    slug: string;
    sectionSlug: string;
  };
  completionStatus?: {
    contentComplete: boolean;
    quizComplete: boolean;
    contentProgress: number;
    quizAccuracy: number;
  };
}

export default function LockedModuleModal({
  isOpen,
  onClose,
  reason,
  previousModuleRequired,
  completionStatus,
}: LockedModuleModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoToPreviousModule = () => {
    if (previousModuleRequired) {
      router.push(`/${previousModuleRequired.sectionSlug}/${previousModuleRequired.slug}`);
    }
  };

  const requiredAccuracy = Math.ceil(MODULE_COMPLETION_THRESHOLD * 100);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔒</span>
            <div>
              <h2 className="text-xl font-bold text-white">Module Locked</h2>
              <p className="text-sm text-yellow-50">Complete previous module to unlock</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            {reason}
          </p>

          {completionStatus && previousModuleRequired && (
            <div className="space-y-3 pt-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Requirements for "{previousModuleRequired.title}":
              </h3>

              {/* Content Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {completionStatus.contentComplete ? '✅' : '❌'} Complete all content
                  </span>
                  <span className={`font-medium ${
                    completionStatus.contentComplete 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {Math.round(completionStatus.contentProgress * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      completionStatus.contentComplete 
                        ? 'bg-green-500 dark:bg-green-400' 
                        : 'bg-orange-500 dark:bg-orange-400'
                    }`}
                    style={{ width: `${completionStatus.contentProgress * 100}%` }}
                  />
                </div>
              </div>

              {/* Quiz Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {completionStatus.quizComplete ? '✅' : '❌'} Pass all quizzes ({requiredAccuracy}%+)
                  </span>
                  <span className={`font-medium ${
                    completionStatus.quizComplete 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-orange-600 dark:text-orange-400'
                  }`}>
                    {Math.round(completionStatus.quizAccuracy * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      completionStatus.quizComplete 
                        ? 'bg-green-500 dark:bg-green-400' 
                        : 'bg-orange-500 dark:bg-orange-400'
                    }`}
                    style={{ width: `${completionStatus.quizAccuracy * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <span className="text-xl">💡</span>
              <p className="text-sm text-blue-900 dark:text-blue-200">
                Complete all content and achieve {requiredAccuracy}% or higher on quizzes to unlock the next module.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
            {previousModuleRequired && (
              <button
                onClick={handleGoToPreviousModule}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all shadow-md hover:shadow-lg"
              >
                Complete Required Module
              </button>
            )}
          <button
            onClick={onClose}
            className={`${previousModuleRequired ? 'px-4' : 'flex-1 px-4'} py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

