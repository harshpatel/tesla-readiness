'use client';

import Link from 'next/link';

interface ModuleCardProps {
  mod: any;
  section: string;
  isCompleted: boolean;
  progressPercent: number;
  completedItems: number;
  totalItems: number;
  isLocked: boolean;
}

export default function ModuleCard({
  mod,
  section,
  isCompleted,
  progressPercent,
  completedItems,
  totalItems,
  isLocked,
}: ModuleCardProps) {
  return (
    <Link
      href={isLocked ? '#' : `/${section}/${mod.slug}`}
      className={`block rounded-xl transition-all p-6 border ${
        isLocked
          ? 'bg-gray-100 opacity-60 cursor-not-allowed border-gray-300'
          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-[#0A84FF]'
      }`}
      onClick={(e) => {
        if (isLocked) {
          e.preventDefault();
        }
      }}
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{mod.icon || '📚'}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-2xl font-semibold ${isLocked ? 'text-gray-500' : 'text-[#1a1a1a]'}`}>
              {mod.title}
            </h3>
            {isLocked && (
              <span className="text-gray-500 text-xl">🔒</span>
            )}
            {!isLocked && isCompleted && (
              <span className="text-green-600 text-xl">✓</span>
            )}
          </div>
          <p className={`text-sm mb-3 ${isLocked ? 'text-gray-500' : 'text-gray-600'}`}>
            {mod.description}
          </p>
          
          {/* Module Progress Bar - Only show for unlocked modules */}
          {!isLocked && totalItems > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="text-gray-600">
                  {completedItems} / {totalItems} completed
                </span>
                <span className="font-bold text-[#0A84FF]">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0A84FF] to-[#0077ED]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className={isLocked ? 'text-gray-400' : 'text-[#0A84FF]'}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

