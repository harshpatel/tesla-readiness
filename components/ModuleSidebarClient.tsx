'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LockedModuleModal from './LockedModuleModal';

interface ContentItem {
  id: string;
  slug: string;
  title: string;
  icon: string;
  type: string;
  progress?: {
    completed: boolean;
  };
}

interface Module {
  id: string;
  slug: string;
  title: string;
  icon: string;
  sectionSlug: string;
  isPublished: boolean;
  isLocked: boolean;
  lockReason?: string;
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
  contentItems: ContentItem[];
  progress?: {
    completedItems: number;
    totalItems: number;
    progressPercent: number;
  };
}

interface Section {
  id: string;
  slug: string;
  title: string;
  icon: string;
  isPublished: boolean;
  modules: Module[];
  progress?: {
    completedModules: number;
    totalModules: number;
    progressPercent: number;
  };
}

interface ModuleSidebarClientProps {
  sections: Section[];
}

export default function ModuleSidebarClient({ sections }: ModuleSidebarClientProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [lockedModuleModal, setLockedModuleModal] = useState<{
    isOpen: boolean;
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
  }>({
    isOpen: false,
    reason: '',
  });
  
  // Automatically expand sections and modules based on current path
  const getInitialExpandedState = () => {
    const pathParts = pathname.split('/').filter(Boolean);
    const currentSection = pathParts[0]; // e.g., 'phase1'
    const currentModule = pathParts[1]; // e.g., 'medical-terminology'
    
    // Expand ALL published sections by default
    const expandedSectionSet = new Set(sections.filter(s => s.isPublished).map(s => s.slug));
    
    // Only expand the CURRENT module if we're viewing a specific page, otherwise expand none
    const expandedModuleSet = new Set<string>();
    
    // If we're on a specific module page (e.g., /phase1/medical-terminology/quiz/prefixes)
    // Only expand THAT module
    if (currentModule) {
      expandedModuleSet.add(currentModule);
    }
    
    return { expandedSections: expandedSectionSet, expandedModules: expandedModuleSet };
  };
  
  const { expandedSections: initialSections, expandedModules: initialModules } = getInitialExpandedState();
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(initialSections);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(initialModules);

  const handleLockedModuleClick = (module: Module) => {
    setLockedModuleModal({
      isOpen: true,
      reason: module.lockReason || 'This module is locked',
      previousModuleRequired: module.previousModuleRequired,
      completionStatus: module.completionStatus,
    });
  };

  const toggleSection = (sectionSlug: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionSlug)) {
        next.delete(sectionSlug);
      } else {
        next.add(sectionSlug);
      }
      return next;
    });
  };

  const toggleModule = (moduleSlug: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleSlug)) {
        next.delete(moduleSlug);
      } else {
        next.add(moduleSlug);
      }
      return next;
    });
  };

  return (
    <>
      {/* Mobile Drawer Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
        aria-label="Toggle navigation menu"
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
          fixed lg:static top-16 lg:top-0 bottom-0 left-0 z-40
          w-96 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700
          transform transition-transform duration-300 ease-in-out
          lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col overflow-y-auto
        `}
      >
        <div className="p-3 space-y-1.5">
          {sections.map((section) => {
            const isSectionExpanded = expandedSections.has(section.slug);
            const hasModules = section.modules.length > 0;

            return (
              <div key={section.id} className="space-y-1">
                {/* Section Header - Compact */}
                {section.isPublished ? (
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-gray-300 dark:border-slate-600 overflow-hidden">
                    <button
                      onClick={() => hasModules && toggleSection(section.slug)}
                      className="w-full px-3 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-lg flex-shrink-0">{section.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate">
                                {section.title}
                              </h2>
                              {section.progress && section.progress.totalModules > 0 && (
                                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded flex-shrink-0">
                                  {section.progress.completedModules}/{section.progress.totalModules}
                                </span>
                              )}
                            </div>
                            {section.progress && section.progress.totalModules > 0 && (
                              <div className="mt-1 flex items-center gap-1.5">
                                <div className="flex-1 h-1 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                                    style={{ width: `${section.progress.progressPercent}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-9 text-right flex-shrink-0">
                                  {section.progress.progressPercent}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {hasModules && (
                          <span
                            className="text-gray-500 dark:text-gray-400 text-xs transition-transform duration-200 flex-shrink-0"
                            style={{ transform: isSectionExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                          >
                            ▼
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Modules Container - Compact List */}
                    {section.isPublished && isSectionExpanded && hasModules && (
                      <div className="px-2 pb-2 space-y-0.5">
                        {section.modules.map((module) => {
                          const isModuleExpanded = expandedModules.has(module.slug);
                          const hasContent = module.contentItems.length > 0;
                          const progressPercent = module.progress?.progressPercent || 0;
                          const completedItems = module.progress?.completedItems || 0;
                          const totalItems = module.progress?.totalItems || 0;
                          
                          // Check if we're on the module overview page OR any page within this module
                          const moduleHref = `/${section.slug}/${module.slug}`;
                          const isModuleActive = pathname === moduleHref || pathname.startsWith(`${moduleHref}/`);

                          return (
                            <div key={module.id} className={`bg-white dark:bg-slate-800 rounded-md border overflow-hidden transition-all duration-200 ${isModuleActive ? 'border-blue-500 shadow-sm opacity-100' : 'border-gray-200 dark:border-slate-700 opacity-30 hover:opacity-100'} ${module.isLocked ? 'opacity-60' : ''}`}>
                              {/* Module Header - Compact */}
                              <div className="group">
                                {module.isPublished && !module.isLocked ? (
                                  <div className="flex items-stretch">
                                    <Link
                                      href={moduleHref}
                                      onClick={() => setIsOpen(false)}
                                      className={`flex-1 px-2.5 py-2 transition-colors ${isModuleActive ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-base flex-shrink-0">{module.icon}</span>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5 mb-0.5">
                                            <span className={`font-semibold text-xs truncate transition-colors ${isModuleActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                              {module.title}
                                            </span>
                                            {progressPercent === 100 && (
                                              <span className={`text-sm flex-shrink-0 ${isModuleActive ? 'text-green-600' : 'text-green-500'}`}>✓</span>
                                            )}
                                            {totalItems > 0 && (
                                              <span className={`text-xs font-medium flex-shrink-0 ml-auto transition-colors ${isModuleActive ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'}`}>
                                                {completedItems}/{totalItems}
                                              </span>
                                            )}
                                          </div>
                                          {totalItems > 0 && (
                                            <div className="flex items-center gap-1">
                                              <div className={`flex-1 h-1 rounded-full overflow-hidden ${isModuleActive ? 'bg-gray-100 dark:bg-slate-700' : 'bg-gray-200 dark:bg-slate-600'}`}>
                                                <div
                                                  className={`h-full rounded-full transition-all ${isModuleActive ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-green-400 to-green-500'}`}
                                                  style={{ width: `${progressPercent}%` }}
                                                />
                                              </div>
                                              <span className={`text-[10px] font-bold w-8 text-right flex-shrink-0 transition-colors ${isModuleActive ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'}`}>
                                                {progressPercent}%
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </Link>
                                    {hasContent && (
                                      <button
                                        onClick={() => toggleModule(module.slug)}
                                        className="px-2 border-l border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center"
                                      >
                                        <span
                                          className={`text-[10px] transition-all duration-200 inline-block ${isModuleActive ? 'text-gray-400 dark:text-gray-500' : 'text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500'}`}
                                          style={{ transform: isModuleExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                                        >
                                          ▼
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                ) : module.isLocked ? (
                                  <button
                                    onClick={() => handleLockedModuleClick(module)}
                                    className="w-full px-2.5 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-base">{module.icon}</span>
                                      <span className="font-semibold text-xs text-gray-600 dark:text-gray-400 flex-1 truncate text-left">
                                        {module.title}
                                      </span>
                                      <span className="text-gray-400 dark:text-gray-500 text-sm">🔒</span>
                                    </div>
                                  </button>
                                ) : (
                                  <div className="px-2.5 py-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-base">{module.icon}</span>
                                      <span className="font-semibold text-xs text-gray-600 flex-1 truncate">
                                        {module.title}
                                      </span>
                                      <span className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                                        Soon
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Content Items - Compact List */}
                              {isModuleExpanded && hasContent && (
                                <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-2 py-1.5 space-y-0.5">
                                  {module.contentItems.map((item) => {
                                    const itemHref = `/${section.slug}/${module.slug}/${item.type}/${item.slug}`;
                                    const isActive = pathname === itemHref;
                                    const isCompleted = item.progress?.completed || false;

                                    return (
                                      <Link
                                        key={item.id}
                                        href={itemHref}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                                          block px-2 py-1.5 rounded transition-all text-xs
                                          ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm font-semibold'
                                            : 'hover:bg-white dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium'
                                          }
                                        `}
                                      >
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-sm">{item.icon}</span>
                                          <span className="flex-1 truncate">
                                            {item.title}
                                          </span>
                                          {isCompleted && (
                                            <span className={`text-xs ${isActive ? 'text-white' : 'text-green-600'}`}>
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-2.5 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 opacity-60">
                    <div className="flex items-center gap-2">
                      <span className="text-base flex-shrink-0">{section.icon}</span>
                      <span className="font-medium text-xs text-gray-600 flex-1 truncate">
                        {section.title}
                      </span>
                      <span className="text-[9px] text-gray-400">Soon</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer - Compact */}
        <div className="px-3 py-2.5 border-t border-gray-200 dark:border-slate-700 mt-auto bg-gray-50 dark:bg-slate-800">
          <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
            <div className="font-bold text-gray-900 dark:text-white">
              {sections.reduce((sum, s) => sum + (s.progress?.completedModules || 0), 0)} / {sections.reduce((sum, s) => sum + (s.progress?.totalModules || 0), 0)} Modules
            </div>
            <div className="text-gray-500 mt-0.5 text-[10px]">
              Track your progress
            </div>
          </div>
        </div>
      </aside>

      {/* Locked Module Modal */}
      <LockedModuleModal
        isOpen={lockedModuleModal.isOpen}
        onClose={() => setLockedModuleModal({ isOpen: false, reason: '' })}
        reason={lockedModuleModal.reason}
        previousModuleRequired={lockedModuleModal.previousModuleRequired}
        completionStatus={lockedModuleModal.completionStatus}
      />
    </>
  );
}

