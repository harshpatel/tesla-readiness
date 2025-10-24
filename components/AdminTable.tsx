'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  role: 'student' | 'admin' | 'master_admin';
  current_streak: number;
  last_activity_date: string | null;
  created_at: string;
}

interface Section {
  id: string;
  slug: string;
  title: string;
  icon: string;
  order_index: number;
}

interface Module {
  id: string;
  section_id: string;
  slug: string;
  title: string;
  order_index: number;
}

interface ContentItem {
  id: string;
  module_id: string;
  type: string;
  title: string;
}

interface ModuleProgress {
  user_id: string;
  module_id: string;
  total_items: number;
  completed_items: number;
  progress_percent: number;
}

interface ContentProgress {
  user_id: string;
  content_item_id: string;
  completed: boolean;
}

interface SectionProgress {
  user_id: string;
  section_id: string;
  total_modules: number;
  completed_modules: number;
  progress_percent: number;
}

interface AdminTableProps {
  users: User[];
  sections: Section[];
  modules: Module[];
  contentItems: ContentItem[];
  moduleProgress: ModuleProgress[];
  contentProgress: ContentProgress[];
  sectionProgress: SectionProgress[];
  error: any;
}

type SortKey = 'name' | 'email' | 'role' | 'joined' | 'overall' | 'streak' | 'lastActivity';
type SortDirection = 'asc' | 'desc';

export default function AdminTable({
  users,
  sections,
  modules,
  contentItems,
  moduleProgress,
  contentProgress,
  sectionProgress,
  error
}: AdminTableProps) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>('joined');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Calculate total content items
  const totalContentItems = contentItems.length;

  // Calculate comprehensive user data
  const enrichedUsers = useMemo(() => {
    return users.map(user => {
      // Overall progress
      const userSectionProgress = sectionProgress.filter(sp => sp.user_id === user.id);
      const overallProgress = userSectionProgress.length > 0
        ? Math.round(userSectionProgress.reduce((sum, sp) => sum + sp.progress_percent, 0) / userSectionProgress.length)
        : 0;

      // Section-level progress
      const sectionProgressMap = new Map<string, number>();
      sections.forEach(section => {
        const progress = sectionProgress.find(sp => sp.user_id === user.id && sp.section_id === section.id);
        sectionProgressMap.set(section.id, progress?.progress_percent || 0);
      });

      // Module-level progress
      const moduleProgressMap = new Map<string, number>();
      modules.forEach(module => {
        const progress = moduleProgress.find(mp => mp.user_id === user.id && mp.module_id === module.id);
        moduleProgressMap.set(module.id, progress?.progress_percent || 0);
      });

      // Content type breakdown
      const userContentProgress = contentProgress.filter(cp => cp.user_id === user.id);
      const completedContentIds = new Set(
        userContentProgress.filter(cp => cp.completed).map(cp => cp.content_item_id)
      );

      const videoItems = contentItems.filter(ci => ci.type === 'video');
      const quizItems = contentItems.filter(ci => ci.type === 'quiz');
      const documentItems = contentItems.filter(ci => ci.type === 'document');

      const videosCompleted = videoItems.filter(vi => completedContentIds.has(vi.id)).length;
      const quizzesCompleted = quizItems.filter(qi => completedContentIds.has(qi.id)).length;
      const documentsCompleted = documentItems.filter(di => completedContentIds.has(di.id)).length;

      return {
        ...user,
        overallProgress,
        sectionProgressMap,
        moduleProgressMap,
        videosCompleted,
        videosTotal: videoItems.length,
        quizzesCompleted,
        quizzesTotal: quizItems.length,
        documentsCompleted,
        documentsTotal: documentItems.length,
      };
    });
  }, [users, sections, modules, contentItems, moduleProgress, contentProgress, sectionProgress]);

  // Sorting
  const sortedUsers = useMemo(() => {
    const sorted = [...enrichedUsers].sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortKey) {
        case 'name':
          aVal = a.full_name || a.first_name || a.email;
          bVal = b.full_name || b.first_name || b.email;
          break;
        case 'email':
          aVal = a.email;
          bVal = b.email;
          break;
        case 'role':
          aVal = a.role;
          bVal = b.role;
          break;
        case 'joined':
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;
        case 'overall':
          aVal = a.overallProgress;
          bVal = b.overallProgress;
          break;
        case 'streak':
          aVal = a.current_streak;
          bVal = b.current_streak;
          break;
        case 'lastActivity':
          aVal = a.last_activity_date ? new Date(a.last_activity_date).getTime() : 0;
          bVal = b.last_activity_date ? new Date(b.last_activity_date).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [enrichedUsers, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <span className="text-gray-400 ml-1">↕</span>;
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'master_admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'student': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'master_admin': return 'Master';
      case 'admin': return 'Admin';
      case 'student': return 'Student';
      default: return role;
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return 'text-green-700 font-semibold';
    if (percent >= 50) return 'text-blue-700 font-medium';
    if (percent >= 20) return 'text-orange-600';
    return 'text-gray-600';
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-red-600 mb-2">⚠️ Error loading data</div>
        <div className="text-sm text-gray-600">{error.message}</div>
      </div>
    );
  }

  if (sortedUsers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-5xl mb-4">👥</div>
        <p className="text-gray-600">No users found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">User Progress Overview</h2>
        <p className="text-xs text-gray-600 mt-1">{sortedUsers.length} total users • Click column headers to sort</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 border-b-2 border-gray-400 sticky top-0">
            <tr>
              {/* Basic Info */}
              <th 
                className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 whitespace-nowrap border-r border-gray-300"
                onClick={() => handleSort('name')}
              >
                Name <SortIcon columnKey="name" />
              </th>
              <th 
                className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 whitespace-nowrap border-r border-gray-300"
                onClick={() => handleSort('email')}
              >
                Email <SortIcon columnKey="email" />
              </th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">
                Phone
              </th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">
                DOB
              </th>
              <th 
                className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 whitespace-nowrap border-r border-gray-300"
                onClick={() => handleSort('role')}
              >
                Role <SortIcon columnKey="role" />
              </th>
              <th 
                className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 whitespace-nowrap border-r border-gray-300"
                onClick={() => handleSort('joined')}
              >
                Joined <SortIcon columnKey="joined" />
              </th>
              
              {/* Activity */}
              <th 
                className="px-3 py-2 text-center font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 whitespace-nowrap border-r border-gray-300"
                onClick={() => handleSort('streak')}
              >
                Streak <SortIcon columnKey="streak" />
              </th>
              <th 
                className="px-3 py-2 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 whitespace-nowrap border-r border-gray-300"
                onClick={() => handleSort('lastActivity')}
              >
                Last Active <SortIcon columnKey="lastActivity" />
              </th>
              
              {/* Overall Progress */}
              <th 
                className="px-3 py-2 text-center font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 whitespace-nowrap border-r border-gray-300 bg-blue-50"
                onClick={() => handleSort('overall')}
              >
                Overall % <SortIcon columnKey="overall" />
              </th>
              
              <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-blue-50">
                Total Items
              </th>
              
              {/* Content Breakdown */}
              <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">
                Videos
              </th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">
                Quizzes
              </th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">
                Documents
              </th>
              
              {/* All Sections Progress */}
              {sections.map(section => (
                <th key={section.id} className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-purple-50">
                  {section.icon} {section.title}
                </th>
              ))}
              
              {/* ALL Modules Progress */}
              {modules.map(module => (
                <th key={module.id} className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-green-50">
                  {module.icon} {module.title}
                </th>
              ))}
              
              {/* Additional Metadata Columns */}
              <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-yellow-50">
                Total Attempts
              </th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-yellow-50">
                Avg Score
              </th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-yellow-50">
                Account Created
              </th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-yellow-50">
                Full Name
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedUsers.map((user, idx) => {
              // Calculate additional stats
              const userContentProg = contentProgress.filter(cp => cp.user_id === user.id);
              const totalAttempts = userContentProg.reduce((sum, cp) => sum + cp.attempts, 0);
              const scoresAvailable = userContentProg.filter(cp => cp.score !== null && cp.score !== undefined);
              const avgScore = scoresAvailable.length > 0
                ? Math.round(scoresAvailable.reduce((sum, cp) => sum + (cp.score || 0), 0) / scoresAvailable.length)
                : 0;
              
              return (
                <tr 
                  key={user.id}
                  className={`hover:bg-blue-50 cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  onClick={() => router.push(`/admin/user/${user.id}`)}
                >
                  {/* Basic Info */}
                  <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap border-r border-gray-200">
                    {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.full_name || '-'}
                  </td>
                  <td className="px-3 py-2 text-gray-700 whitespace-nowrap border-r border-gray-200">
                    {user.email}
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap border-r border-gray-200">
                    {user.phone || '-'}
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap border-r border-gray-200">
                    {user.date_of_birth ? formatDate(user.date_of_birth) : '-'}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap border-r border-gray-200">
                    {formatDate(user.created_at)}
                  </td>
                  
                  {/* Activity */}
                  <td className="px-3 py-2 text-center font-semibold border-r border-gray-200">
                    {user.current_streak > 0 ? (
                      <span className="text-orange-600">{user.current_streak}🔥</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap border-r border-gray-200">
                    {formatDate(user.last_activity_date)}
                  </td>
                  
                  {/* Overall Progress */}
                  <td className={`px-3 py-2 text-center font-semibold border-r border-gray-200 ${getProgressColor(user.overallProgress)}`}>
                    {user.overallProgress}%
                  </td>
                  
                  <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-200">
                    <span className={user.videosCompleted + user.quizzesCompleted + user.documentsCompleted === totalContentItems ? 'text-green-700 font-semibold' : 'font-medium'}>
                      {user.videosCompleted + user.quizzesCompleted + user.documentsCompleted}
                    </span>
                    <span className="text-gray-400">/{totalContentItems}</span>
                  </td>
                  
                  {/* Content Breakdown */}
                  <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-200">
                    <span className={user.videosCompleted === user.videosTotal ? 'text-green-700 font-semibold' : ''}>
                      {user.videosCompleted}
                    </span>
                    <span className="text-gray-400">/{user.videosTotal}</span>
                  </td>
                  <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-200">
                    <span className={user.quizzesCompleted === user.quizzesTotal ? 'text-green-700 font-semibold' : ''}>
                      {user.quizzesCompleted}
                    </span>
                    <span className="text-gray-400">/{user.quizzesTotal}</span>
                  </td>
                  <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-200">
                    <span className={user.documentsCompleted === user.documentsTotal ? 'text-green-700 font-semibold' : ''}>
                      {user.documentsCompleted}
                    </span>
                    <span className="text-gray-400">/{user.documentsTotal}</span>
                  </td>
                  
                  {/* All Sections Progress */}
                  {sections.map(section => {
                    const progress = user.sectionProgressMap.get(section.id) || 0;
                    return (
                      <td key={section.id} className={`px-3 py-2 text-center font-medium border-r border-gray-200 ${getProgressColor(progress)}`}>
                        {progress}%
                      </td>
                    );
                  })}
                  
                  {/* ALL Modules Progress */}
                  {modules.map(module => {
                    const progress = user.moduleProgressMap.get(module.id) || 0;
                    return (
                      <td key={module.id} className={`px-3 py-2 text-center border-r border-gray-200 ${getProgressColor(progress)}`}>
                        {progress}%
                      </td>
                    );
                  })}
                  
                  {/* Additional Metadata */}
                  <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-200">
                    {totalAttempts}
                  </td>
                  <td className={`px-3 py-2 text-center font-medium border-r border-gray-200 ${getProgressColor(avgScore)}`}>
                    {avgScore > 0 ? `${avgScore}%` : '-'}
                  </td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap border-r border-gray-200">
                    {new Date(user.created_at).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-3 py-2 text-gray-700 whitespace-nowrap border-r border-gray-200">
                    {user.full_name || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

