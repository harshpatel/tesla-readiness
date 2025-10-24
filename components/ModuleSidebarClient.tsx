'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  
  // Automatically expand sections and modules based on current path
  const getInitialExpandedState = () => {
    const pathParts = pathname.split('/').filter(Boolean);
    const currentModule = pathParts[1]; // e.g., 'medical-terminology'
    
    // Always expand ALL published sections by default
    const expandedSectionSet = new Set(sections.filter(s => s.isPublished).map(s => s.slug));
    
    // Always expand ALL published, unlocked modules by default
    const expandedModuleSet = new Set<string>();
    sections.forEach(section => {
      if (section.isPublished) {
        section.modules.forEach(module => {
          if (module.isPublished && !module.isLocked) {
            expandedModuleSet.add(module.slug);
          }
        });
      }
    });
    
    return { expandedSections: expandedSectionSet, expandedModules: expandedModuleSet };
  };
  
  const { expandedSections: initialSections, expandedModules: initialModules } = getInitialExpandedState();
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(initialSections);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(initialModules);

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
        className="lg:hidden fixed top-20 left-4 z-50 flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-all"
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
          w-96 bg-white border-r border-gray-200
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
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-300 overflow-hidden">
                    <button
                      onClick={() => hasModules && toggleSection(section.slug)}
                      className="w-full px-3 py-2.5 text-left hover:bg-gray-100 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-lg flex-shrink-0">{section.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h2 className="text-sm font-bold text-gray-900 leading-tight truncate">
                                {section.title}
                              </h2>
                              {section.progress && section.progress.totalModules > 0 && (
                                <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-0.5 rounded flex-shrink-0">
                                  {section.progress.completedModules}/{section.progress.totalModules}
                                </span>
                              )}
                            </div>
                            {section.progress && section.progress.totalModules > 0 && (
                              <div className="mt-1 flex items-center gap-1.5">
                                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                                    style={{ width: `${section.progress.progressPercent}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-gray-700 w-9 text-right flex-shrink-0">
                                  {section.progress.progressPercent}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {hasModules && (
                          <span
                            className="text-gray-500 text-xs transition-transform duration-200 flex-shrink-0"
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
                            <div key={module.id} className={`bg-white rounded-md border ${isModuleActive ? 'border-blue-500 shadow-sm' : 'border-gray-200'} overflow-hidden ${module.isLocked ? 'opacity-60' : ''}`}>
                              {/* Module Header - Compact */}
                              <div>
                                {module.isPublished && !module.isLocked ? (
                                  <div className="flex items-stretch">
                                    <Link
                                      href={moduleHref}
                                      onClick={() => setIsOpen(false)}
                                      className={`flex-1 px-2.5 py-2 transition-colors ${isModuleActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-base flex-shrink-0">{module.icon}</span>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5 mb-0.5">
                                            <span className={`font-semibold text-xs truncate ${isModuleActive ? 'text-blue-700' : 'text-gray-900'}`}>
                                              {module.title}
                                            </span>
                                            {progressPercent === 100 && (
                                              <span className="text-green-600 text-sm flex-shrink-0">✓</span>
                                            )}
                                            {totalItems > 0 && (
                                              <span className="text-xs font-medium text-gray-500 flex-shrink-0 ml-auto">
                                                {completedItems}/{totalItems}
                                              </span>
                                            )}
                                          </div>
                                          {totalItems > 0 && (
                                            <div className="flex items-center gap-1">
                                              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                                                  style={{ width: `${progressPercent}%` }}
                                                />
                                              </div>
                                              <span className="text-[10px] font-bold text-gray-600 w-8 text-right flex-shrink-0">
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
                                        className="px-2 border-l border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
                                      >
                                        <span
                                          className="text-gray-400 text-[10px] transition-transform duration-200 inline-block"
                                          style={{ transform: isModuleExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                                        >
                                          ▼
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                ) : module.isLocked ? (
                                  <div className="px-2.5 py-2 cursor-not-allowed">
                                    <div className="flex items-center gap-2">
                                      <span className="text-base">{module.icon}</span>
                                      <span className="font-semibold text-xs text-gray-600 flex-1 truncate">
                                        {module.title}
                                      </span>
                                      <span className="text-gray-400 text-sm">🔒</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="px-2.5 py-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-base">{module.icon}</span>
                                      <span className="font-semibold text-xs text-gray-600 flex-1 truncate">
                                        {module.title}
                                      </span>
                                      <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                        Soon
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Content Items - Compact List */}
                              {isModuleExpanded && hasContent && (
                                <div className="border-t border-gray-200 bg-gray-50 px-2 py-1.5 space-y-0.5">
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
                                            : 'hover:bg-white text-gray-700 font-medium'
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
                  <div className="px-2.5 py-2 rounded-lg border border-gray-200 bg-gray-50 opacity-60">
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
        <div className="px-3 py-2.5 border-t border-gray-200 mt-auto bg-gray-50">
          <div className="text-xs text-gray-600 text-center">
            <div className="font-bold text-gray-900">
              {sections.reduce((sum, s) => sum + (s.progress?.completedModules || 0), 0)} / {sections.reduce((sum, s) => sum + (s.progress?.totalModules || 0), 0)} Modules
            </div>
            <div className="text-gray-500 mt-0.5 text-[10px]">
              Track your progress
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

