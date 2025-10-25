'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Module {
  id: string;
  title: string;
  icon: string;
  order_index: number;
  section_id: string;
  section?: {
    order_index: number;
  };
}

interface ModuleOverride {
  module_id: string;
  is_unlocked: boolean;
  unlocked_by: string;
  created_at: string;
}

interface ModuleAccessInfo {
  canAccess: boolean;
  isLocked: boolean;
  unlockedByAdmin?: boolean;
  adminUnlockInfo?: {
    unlockedBy: string;
    unlockedAt: string;
  };
}

interface ModuleAccessManagerProps {
  userId: string;
  modules: Module[];
}

export default function ModuleAccessManager({ userId, modules }: ModuleAccessManagerProps) {
  const router = useRouter();
  const [overrides, setOverrides] = useState<ModuleOverride[]>([]);
  const [moduleAccessStatus, setModuleAccessStatus] = useState<Record<string, ModuleAccessInfo>>({});
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [showSection, setShowSection] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Fetch existing overrides and access status on mount
  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setIsLoadingStatus(true);
    try {
      // Fetch access status for all modules
      const statusPromises = modules.map(async (module) => {
        const response = await fetch(`/api/admin/module-access-status?userId=${userId}&moduleId=${module.id}`);
        if (response.ok) {
          const data = await response.json();
          return { moduleId: module.id, status: data.accessStatus };
        }
        return { moduleId: module.id, status: { canAccess: false, isLocked: true } };
      });

      const statuses = await Promise.all(statusPromises);
      const statusMap: Record<string, ModuleAccessInfo> = {};
      statuses.forEach(({ moduleId, status }) => {
        statusMap[moduleId] = status;
      });
      setModuleAccessStatus(statusMap);
    } catch (error) {
      console.error('Error fetching module data:', error);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleToggleLock = async (moduleId: string, currentlyUnlocked: boolean) => {
    setLoading({ ...loading, [moduleId]: true });

    try {
      const response = await fetch('/api/admin/module-override', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          moduleId,
          action: currentlyUnlocked ? 'lock' : 'unlock',
        }),
      });

      if (response.ok) {
        // Refresh the page to show updated state
        router.refresh();
        // Refetch all data to get updated status
        await fetchData();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error toggling module lock:', error);
      alert('An error occurred');
    } finally {
      setLoading({ ...loading, [moduleId]: false });
    }
  };

  // Sort modules by section order_index first, then module order_index
  const sortedModules = [...modules].sort((a, b) => {
    const sectionOrderA = a.section?.order_index ?? 0;
    const sectionOrderB = b.section?.order_index ?? 0;
    
    if (sectionOrderA !== sectionOrderB) {
      return sectionOrderA - sectionOrderB;
    }
    return a.order_index - b.order_index;
  });

  return (
    <div className="mb-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header - Collapsible */}
      <button
        onClick={() => setShowSection(!showSection)}
        className="w-full px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800 flex items-center justify-between hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔐</span>
          <div className="text-left">
            <h3 className="text-sm font-bold text-purple-900 dark:text-purple-200">
              Module Access Management
            </h3>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              Unlock modules for this student (bypasses progression requirements)
            </p>
          </div>
        </div>
        <span className="text-purple-600 dark:text-purple-400">
          {showSection ? '▼' : '▶'}
        </span>
      </button>

      {/* Module List */}
      {showSection && (
        <div className="p-4">
          {isLoadingStatus ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading module status...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortedModules.map((module, index) => {
                const accessStatus = moduleAccessStatus[module.id];
                const isLoading = loading[module.id] || false;
                const isFirstModule = index === 0; // First module in the entire sorted list
                
                // Module is naturally unlocked if canAccess is true and it's not locked
                const isNaturallyUnlocked = accessStatus?.canAccess && !accessStatus?.isLocked;
                
                // Module has an admin override if it has admin unlock info
                const hasAdminOverride = accessStatus?.unlockedByAdmin || false;
                
                // Show as "unlocked" if either naturally unlocked OR has admin override
                const isUnlocked = isNaturallyUnlocked || hasAdminOverride;

                return (
                  <div
                    key={module.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xl flex-shrink-0">{module.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {module.title}
                        </p>
                        {isFirstModule && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Always unlocked
                          </p>
                        )}
                        {!isFirstModule && isNaturallyUnlocked && !hasAdminOverride && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            ✅ Unlocked (completed previous)
                          </p>
                        )}
                        {!isFirstModule && hasAdminOverride && (
                          <p className="text-xs text-purple-600 dark:text-purple-400">
                            🔓 Unlocked by admin
                          </p>
                        )}
                        {!isFirstModule && !isUnlocked && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            🔒 Locked (needs previous module)
                          </p>
                        )}
                      </div>
                    </div>
                    {!isFirstModule && (
                      <button
                        onClick={() => handleToggleLock(module.id, hasAdminOverride)}
                        disabled={isLoading}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          hasAdminOverride
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                        }`}
                      >
                        {isLoading ? '...' : hasAdminOverride ? '🔒 Lock' : '🔓 Unlock'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

