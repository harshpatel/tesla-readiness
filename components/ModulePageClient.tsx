'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LockedModuleModal from './LockedModuleModal';
import type { ModuleAccessStatus } from '@/lib/module-access';

interface ModulePageClientProps {
  moduleData: any;
  sectionData: any;
  contentItemsWithProgress: any[];
  progressPercent: number;
  completedItems: number;
  totalItems: number;
  section: string;
  module: string;
  accessStatus: ModuleAccessStatus;
}

export default function ModulePageClient({
  moduleData,
  sectionData,
  contentItemsWithProgress,
  progressPercent,
  completedItems,
  totalItems,
  section,
  module,
  accessStatus,
}: ModulePageClientProps) {
  const [showLockModal, setShowLockModal] = useState(false);

  // Show modal on mount if module is locked
  useEffect(() => {
    if (accessStatus.isLocked) {
      setShowLockModal(true);
    }
  }, [accessStatus.isLocked]);

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/dashboard" className="hover:text-[#0A84FF]">Dashboard</Link>
          <span className="mx-2">/</span>
          <Link href={`/${section}`} className="hover:text-[#0A84FF]">{sectionData.title}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white font-medium">{moduleData.title}</span>
        </nav>

        {/* Combined Card with Header and Content Items */}
        <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden ${
          accessStatus.isLocked ? 'opacity-60 pointer-events-none' : ''
        }`}>
          {/* Module Header */}
          <div className="p-8">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-5xl">{moduleData.icon || '📚'}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-[#1a1a1a] dark:text-white mb-2">
                    {moduleData.title}
                  </h1>
                  {accessStatus.isLocked && (
                    <span className="text-3xl">🔒</span>
                  )}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {moduleData.description}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {totalItems > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Progress: {completedItems} / {totalItems} completed
                  </span>
                  <span className="text-sm font-bold text-[#0A84FF]">
                    {progressPercent}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0A84FF] to-[#0077ED] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dashed Divider */}
          {contentItemsWithProgress.length > 0 && (
            <div className="border-t-2 border-dashed border-gray-300 dark:border-slate-600 mx-8"></div>
          )}

          {/* Content Items List */}
          {contentItemsWithProgress.length > 0 && (
            <div className="p-8 space-y-4">
              {contentItemsWithProgress.map((item) => {
                const isCompleted = item.progress?.completed || false;
                const typeLabel = item.type === 'quiz' ? '📝 Quiz' : 
                                 item.type === 'video' ? '🎥 Video' :
                                 item.type === 'reading' ? '📖 Reading' : item.type;
                
                const href = item.type === 'quiz' 
                  ? `/${section}/${module}/quiz/${item.slug}`
                  : `/${section}/${module}/${item.type}/${item.slug}`;

                return (
                  <Link
                    key={item.id}
                    href={href}
                    className="block bg-gray-50 dark:bg-slate-900 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all p-6 border border-gray-200 dark:border-slate-700 hover:border-[#0A84FF]"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{item.icon || '📄'}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-[#1a1a1a] dark:text-white">
                            {item.title}
                          </h3>
                          {isCompleted && (
                            <span className="text-green-600 text-lg">✓</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        <div className="mt-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                            {typeLabel}
                          </span>
                        </div>
                      </div>
                      <div className="text-[#0A84FF]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {(!contentItemsWithProgress || contentItemsWithProgress.length === 0) && (
            <div className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No content available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Lock Modal */}
      {accessStatus.isLocked && (
        <LockedModuleModal
          isOpen={showLockModal}
          onClose={() => setShowLockModal(false)}
          reason={accessStatus.reason || 'This module is locked'}
          previousModuleRequired={accessStatus.previousModuleRequired}
          completionStatus={accessStatus.completionStatus}
        />
      )}
    </>
  );
}

