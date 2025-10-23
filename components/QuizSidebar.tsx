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

const OTHER_SECTIONS = [
  { key: 'onboarding', title: 'Onboarding', icon: '👋', disabled: true },
  { key: 'phase1', title: 'Phase 1', icon: '1️⃣', disabled: true },
  { key: 'phase2', title: 'Phase 2', icon: '2️⃣', disabled: true },
  { key: 'clinical', title: 'Clinical Site Readiness', icon: '🏥', disabled: true },
  { key: 'registry', title: 'Registry Prep', icon: '📜', disabled: true },
];

export default function QuizSidebar({ sections }: QuizSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
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
          w-80 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Other Sections (Non-collapsible) */}
        <div className="px-4 pt-4 space-y-2">
          {OTHER_SECTIONS.map((section) => (
            <div
              key={section.key}
              className="px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg flex-shrink-0">{section.icon}</span>
                <span className="font-medium text-sm text-gray-600 flex-1">
                  {section.title}
                </span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          ))}
        </div>

        {/* Medical Terminology Header - Clickable to collapse/expand */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mx-4 mt-4 mb-2 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 w-[calc(100%-2rem)] text-left hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">📚</span>
                <h2 className="text-lg font-bold text-[#1a1a1a]">
                  Medical Terminology
                </h2>
              </div>
              <p className="text-xs text-gray-600 ml-8">
                {sections.filter(s => s.progress?.completed).length} of {sections.length} sections completed
              </p>
            </div>
            <span className="text-gray-400 text-lg ml-2 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
              ▼
            </span>
          </div>
        </button>

        {/* Sections List - Collapsible */}
        <nav className={`flex-1 overflow-y-auto px-4 pb-4 transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-full' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <div className="pl-3 border-l-2 border-blue-200">
            <ul className="space-y-2 ml-3">
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
                      block px-3 py-2.5 rounded-lg transition-all border
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-[#0A84FF] to-[#0077ED] text-white shadow-md border-[#0077ED]'
                          : 'hover:bg-blue-50 text-gray-700 border-transparent hover:border-blue-200 bg-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-lg flex-shrink-0">
                        {section.icon}
                      </span>
                      <span className="font-medium text-sm flex-1">
                        {section.title}
                      </span>
                      {progress && progress.completed && (
                        <span className="text-sm">✓</span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {progress && progress.total > 0 && (
                      <div className="ml-7">
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
          </div>
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

