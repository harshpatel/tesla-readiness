'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Section {
  key: string;
  title: string;
  icon: string;
  progress?: {
    mastered: number;
    total: number;
    completed: boolean;
  };
}

interface QuizSidebarProps {
  sections: Section[];
}

export default function QuizSidebar({ sections }: QuizSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Drawer Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-all"
        aria-label="Toggle quiz sections menu"
      >
        <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">
            📚 Medical Terminology
          </h2>
          <p className="text-sm text-gray-600">
            Choose a section to practice
          </p>
        </div>

        {/* Sections List */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {sections.map((section) => {
              const isActive = pathname === `/quiz/${section.key}`;
              const progress = section.progress;
              const progressPercent = progress
                ? Math.round((progress.mastered / progress.total) * 100)
                : 0;

              return (
                <li key={section.key}>
                  <Link
                    href={`/quiz/${section.key}`}
                    onClick={() => setIsOpen(false)}
                    className={`
                      block px-4 py-3 rounded-lg transition-all
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-[#0A84FF] to-[#0077ED] text-white shadow-md'
                          : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl flex-shrink-0">
                        {section.icon}
                      </span>
                      <span className="font-semibold text-sm flex-1">
                        {section.title}
                      </span>
                      {progress && progress.completed && (
                        <span className="text-sm">✓</span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {progress && progress.total > 0 && (
                      <div className="ml-8">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className={isActive ? 'text-white/90' : 'text-gray-600'}>
                            {progress.mastered} / {progress.total}
                          </span>
                          <span className={isActive ? 'text-white/90' : 'text-gray-600'}>
                            {progressPercent}%
                          </span>
                        </div>
                        <div
                          className={`h-1.5 rounded-full overflow-hidden ${
                            isActive ? 'bg-white/30' : 'bg-gray-200'
                          }`}
                        >
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isActive ? 'bg-white' : 'bg-gradient-to-r from-[#0A84FF] to-[#0077ED]'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-600 text-center">
            <div className="mb-2">
              <strong className="text-[#1a1a1a]">
                {sections.filter(s => s.progress?.completed).length} / {sections.length}
              </strong>{' '}
              sections completed
            </div>
            <div className="text-[10px]">
              Track your progress as you master medical terminology
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

