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
          w-80 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col overflow-y-auto
        `}
      >
        <div className="p-4 space-y-3">
          {sections.map((section) => {
            const isSectionExpanded = expandedSections.has(section.slug);
            const hasModules = section.modules.length > 0;

            return (
              <div key={section.id} className="space-y-2">
                {/* Section Header - Prominent Card */}
                {section.isPublished ? (
                  <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
                    <button
                      onClick={() => hasModules && toggleSection(section.slug)}
                      className="w-full p-4 text-left hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                            {section.icon}
                          </div>
                          <div>
                            <h2 className="text-base font-bold text-[#1a1a1a] leading-tight">
                              {section.title}
                            </h2>
                            {section.progress && section.progress.totalModules > 0 && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {section.progress.completedModules} / {section.progress.totalModules} modules
                              </p>
                            )}
                          </div>
                        </div>
                        {hasModules && (
                          <span
                            className="text-gray-400 text-base transition-transform duration-200"
                            style={{ transform: isSectionExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                          >
                            ▼
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Modules Container - Visually contained within section */}
                    {section.isPublished && isSectionExpanded && hasModules && (
                      <div className="px-3 pb-3 space-y-2">
                        {section.modules.map((module) => {
                          const isModuleExpanded = expandedModules.has(module.slug);
                          const hasContent = module.contentItems.length > 0;
                          const progressPercent = module.progress?.progressPercent || 0;

                          return (
                            <div key={module.id} className={`bg-gray-50 rounded-lg border border-gray-200 overflow-hidden ${module.isLocked ? 'opacity-60' : ''}`}>
                              {/* Module Header */}
                              <div>
                                {module.isPublished && !module.isLocked ? (
                                  <div className="flex items-stretch">
                                    <Link
                                      href={`/${section.slug}/${module.slug}`}
                                      onClick={() => setIsOpen(false)}
                                      className="flex-1 p-3 hover:bg-white transition-colors"
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <span className="text-xl">{module.icon}</span>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm text-gray-900">
                                              {module.title}
                                            </span>
                                            {progressPercent === 100 && (
                                              <span className="text-green-600 text-sm">✓</span>
                                            )}
                                          </div>
                                          {module.progress && module.progress.totalItems > 0 && (
                                            <div className="mt-1.5">
                                              <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-gray-600">
                                                  {module.progress.completedItems} / {module.progress.totalItems} items
                                                </span>
                                                <span className="text-gray-600 font-medium">{progressPercent}%</span>
                                              </div>
                                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                  className="h-full bg-gradient-to-r from-[#0A84FF] to-[#0077ED] rounded-full transition-all"
                                                  style={{ width: `${progressPercent}%` }}
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </Link>
                                    {hasContent && (
                                      <button
                                        onClick={() => toggleModule(module.slug)}
                                        className="px-3 border-l border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
                                      >
                                        <span
                                          className="text-gray-400 text-sm transition-transform duration-200 inline-block"
                                          style={{ transform: isModuleExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                                        >
                                          ▼
                                        </span>
                                      </button>
                                    )}
                                  </div>
                                ) : module.isLocked ? (
                                  <div className="p-3 cursor-not-allowed">
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-xl">{module.icon}</span>
                                      <span className="font-semibold text-sm text-gray-600 flex-1">
                                        {module.title}
                                      </span>
                                      <span className="text-gray-400 text-base">🔒</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="p-3">
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-xl">{module.icon}</span>
                                      <span className="font-semibold text-sm text-gray-600 flex-1">
                                        {module.title}
                                      </span>
                                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                        Coming Soon
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Content Items - Nested inside module */}
                              {isModuleExpanded && hasContent && (
                                <div className="border-t border-gray-200 bg-white p-2.5 space-y-1">
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
                                          block px-3 py-2.5 rounded-lg transition-all text-sm
                                          ${isActive
                                            ? 'bg-gradient-to-r from-[#0A84FF] to-[#0077ED] text-white shadow-md scale-[1.02]'
                                            : 'hover:bg-white hover:shadow-sm text-gray-700'
                                          }
                                        `}
                                      >
                                        <div className="flex items-center gap-2.5">
                                          <span className="text-base">{item.icon}</span>
                                          <span className={`flex-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                            {item.title}
                                          </span>
                                          {isCompleted && (
                                            <span className={`text-sm ${isActive ? 'text-white' : 'text-green-600'}`}>
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
                  <div className="p-3 rounded-xl border border-gray-200 bg-gray-50 opacity-60">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg flex-shrink-0">{section.icon}</span>
                      <span className="font-medium text-sm text-gray-600 flex-1">
                        {section.title}
                      </span>
                      <span className="text-xs text-gray-400">Coming Soon</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="text-xs text-gray-600 text-center">
            <div className="mb-2">
              <strong className="text-[#1a1a1a]">
                {sections.reduce((sum, s) => sum + (s.progress?.completedModules || 0), 0)} /{' '}
                {sections.reduce((sum, s) => sum + (s.progress?.totalModules || 0), 0)}
              </strong>{' '}
              modules completed
            </div>
            <div className="text-[10px]">
              Track your progress as you learn
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

