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
  icon: string;
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
  attempts: number;
  score: number | null;
}

interface SectionProgress {
  user_id: string;
  section_id: string;
  total_modules: number;
  completed_modules: number;
  progress_percent: number;
}

interface QuizProgress {
  user_id: string;
  question_id: string;
  easiness_factor: number;
  interval: number;
  repetitions: number;
  next_review_date: string;
  last_reviewed_at: string | null;
  total_attempts: number;
  correct_attempts: number;
}

interface QuizQuestion {
  id: string;
  section_key: string;
  question_id: string;
  question_type: string;
}

interface AdminTableProps {
  users: User[];
  sections: Section[];
  modules: Module[];
  contentItems: ContentItem[];
  moduleProgress: ModuleProgress[];
  contentProgress: ContentProgress[];
  sectionProgress: SectionProgress[];
  quizProgress: QuizProgress[];
  quizQuestions: QuizQuestion[];
  error: any;
}

type SortKey = 'name' | 'email' | 'role' | 'joined' | 'overall' | 'streak' | 'lastActivity' | 'quizAccuracy' | 'status';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | 'active' | 'inactive' | 'at-risk' | 'struggling';

export default function AdminTable({
  users,
  sections,
  modules,
  contentItems,
  moduleProgress,
  contentProgress,
  sectionProgress,
  quizProgress,
  quizQuestions,
  error
}: AdminTableProps) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>('joined');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

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

      // Quiz performance metrics
      const userQuizProgress = quizProgress.filter(qp => qp.user_id === user.id);
      const totalQuizAttempts = userQuizProgress.reduce((sum, qp) => sum + qp.total_attempts, 0);
      const totalCorrectAttempts = userQuizProgress.reduce((sum, qp) => sum + qp.correct_attempts, 0);
      const quizAccuracy = totalQuizAttempts > 0 
        ? Math.round((totalCorrectAttempts / totalQuizAttempts) * 100)
        : 0;
      const questionsAttempted = userQuizProgress.length;
      const totalQuestions = quizQuestions.length;
      
      // Average easiness factor (indicates difficulty/mastery)
      const avgEasinessFactor = userQuizProgress.length > 0
        ? userQuizProgress.reduce((sum, qp) => sum + qp.easiness_factor, 0) / userQuizProgress.length
        : 0;

      // Student status determination
      const lastActive = user.last_activity_date ? new Date(user.last_activity_date) : null;
      const daysSinceActive = lastActive ? (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24) : 999;
      
      let status: 'active' | 'inactive' | 'at-risk' | 'struggling' | 'new';
      if (overallProgress === 0 && daysSinceActive > 7) {
        status = 'inactive';
      } else if (overallProgress > 0 && overallProgress < 30 && daysSinceActive > 14) {
        status = 'at-risk';
      } else if (quizAccuracy > 0 && quizAccuracy < 50 && totalQuizAttempts > 10) {
        status = 'struggling';
      } else if (daysSinceActive <= 7) {
        status = 'active';
      } else if (overallProgress === 0 && daysSinceActive <= 7) {
        status = 'new';
      } else {
        status = 'inactive';
      }

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
        quizAccuracy,
        totalQuizAttempts,
        questionsAttempted,
        totalQuestions,
        avgEasinessFactor,
        status,
        daysSinceActive: Math.round(daysSinceActive),
      };
    });
  }, [users, sections, modules, contentItems, moduleProgress, contentProgress, sectionProgress, quizProgress, quizQuestions]);

  // Filtering and searching
  const filteredUsers = useMemo(() => {
    let filtered = enrichedUsers;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(term) ||
        user.full_name?.toLowerCase().includes(term) ||
        user.first_name?.toLowerCase().includes(term) ||
        user.last_name?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    return filtered;
  }, [enrichedUsers, searchTerm, statusFilter]);

  // Sorting
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
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
        case 'quizAccuracy':
          aVal = a.quizAccuracy;
          bVal = b.quizAccuracy;
          break;
        case 'status':
          // Status priority: struggling > at-risk > inactive > new > active
          const statusPriority = { 'struggling': 0, 'at-risk': 1, 'inactive': 2, 'new': 3, 'active': 4 };
          aVal = statusPriority[a.status];
          bVal = statusPriority[b.status];
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredUsers, sortKey, sortDirection]);

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
      case 'master_admin': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700';
      case 'admin': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700';
      case 'student': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700';
      default: return 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-slate-600';
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700">🟢 Active</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">⚪ Inactive</span>;
      case 'at-risk':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700">⚠️ At Risk</span>;
      case 'struggling':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700">🔴 Struggling</span>;
      case 'new':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">✨ New</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">-</span>;
    }
  };

  const getStatusCount = (status: StatusFilter) => {
    if (status === 'all') return enrichedUsers.length;
    return enrichedUsers.filter(u => u.status === status).length;
  };

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center">
        <div className="text-red-600 mb-2">⚠️ Error loading data</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{error.message}</div>
      </div>
    );
  }

  if (sortedUsers.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center">
        <div className="text-5xl mb-4">👥</div>
        <p className="text-gray-600 dark:text-gray-400">No users found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="bg-gray-50 dark:bg-slate-900 px-4 py-4 border-b border-gray-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">User Progress Overview</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {sortedUsers.length} {sortedUsers.length === 1 ? 'user' : 'users'} shown • Click column headers to sort
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          />
          
          {/* Status Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              All ({getStatusCount('all')})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              🟢 Active ({getStatusCount('active')})
            </button>
            <button
              onClick={() => setStatusFilter('at-risk')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === 'at-risk'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              ⚠️ At Risk ({getStatusCount('at-risk')})
            </button>
            <button
              onClick={() => setStatusFilter('struggling')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === 'struggling'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              🔴 Struggling ({getStatusCount('struggling')})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === 'inactive'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              ⚪ Inactive ({getStatusCount('inactive')})
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 dark:bg-slate-700 border-b-2 border-gray-400 sticky top-0">
            <tr>
              {/* Basic Info */}
              <th 
                className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 whitespace-nowrap border-r border-gray-300 dark:border-slate-600"
                onClick={() => handleSort('name')}
              >
                Name <SortIcon columnKey="name" />
              </th>
              <th 
                className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 whitespace-nowrap border-r border-gray-300 dark:border-slate-600"
                onClick={() => handleSort('email')}
              >
                Email <SortIcon columnKey="email" />
              </th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600">
                Phone
              </th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600">
                DOB
              </th>
              <th 
                className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 whitespace-nowrap border-r border-gray-300 dark:border-slate-600"
                onClick={() => handleSort('role')}
              >
                Role <SortIcon columnKey="role" />
              </th>
              <th 
                className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 whitespace-nowrap border-r border-gray-300 dark:border-slate-600"
                onClick={() => handleSort('joined')}
              >
                Joined <SortIcon columnKey="joined" />
              </th>
              
              {/* Activity */}
              <th 
                className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 whitespace-nowrap border-r border-gray-300 dark:border-slate-600"
                onClick={() => handleSort('streak')}
              >
                Streak <SortIcon columnKey="streak" />
              </th>
              <th 
                className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 whitespace-nowrap border-r border-gray-300 dark:border-slate-600"
                onClick={() => handleSort('lastActivity')}
              >
                Last Active <SortIcon columnKey="lastActivity" />
              </th>
              
              {/* Status */}
              <th 
                className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 whitespace-nowrap border-r border-gray-300 dark:border-slate-600 bg-yellow-50 dark:bg-slate-700"
                onClick={() => handleSort('status')}
              >
                Status <SortIcon columnKey="status" />
              </th>
              
              {/* Quiz Performance */}
              <th 
                className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 whitespace-nowrap border-r border-gray-300 dark:border-slate-600 bg-orange-50 dark:bg-slate-700"
                onClick={() => handleSort('quizAccuracy')}
              >
                Quiz Accuracy <SortIcon columnKey="quizAccuracy" />
              </th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600 bg-orange-50 dark:bg-slate-700">
                Quiz Progress
              </th>
              
              {/* Overall Progress */}
              <th 
                className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 whitespace-nowrap border-r border-gray-300 dark:border-slate-600 bg-blue-50 dark:bg-slate-700"
                onClick={() => handleSort('overall')}
              >
                Overall % <SortIcon columnKey="overall" />
              </th>
              
              <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600 bg-blue-50 dark:bg-slate-700">
                Total Items
              </th>
              
              {/* Content Breakdown */}
              <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600">
                Videos
              </th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600">
                Quizzes
              </th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600">
                Documents
              </th>
              
              {/* All Sections Progress */}
              {sections.map(section => (
                <th key={section.id} className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600 bg-purple-50 dark:bg-slate-700">
                  {section.icon} {section.title}
                </th>
              ))}
              
              {/* ALL Modules Progress */}
              {modules.map(module => (
                <th key={module.id} className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600 bg-green-50 dark:bg-slate-700">
                  {module.icon} {module.title}
                </th>
              ))}
              
              {/* Additional Metadata Columns */}
              <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600 bg-yellow-50 dark:bg-slate-700">
                Total Attempts
              </th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600 bg-yellow-50 dark:bg-slate-700">
                Avg Score
              </th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600 bg-yellow-50 dark:bg-slate-700">
                Account Created
              </th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-300 dark:border-slate-600 bg-yellow-50 dark:bg-slate-700">
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
                  className={`hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-900'}`}
                  onClick={() => router.push(`/admin/user/${user.id}`)}
                >
                  {/* Basic Info */}
                  <td className="px-3 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-slate-700">
                    {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.full_name || '-'}
                  </td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-200 dark:border-slate-700">
                    {user.email}
                  </td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-slate-700">
                    {user.phone || '-'}
                  </td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-slate-700">
                    {user.date_of_birth ? formatDate(user.date_of_birth) : '-'}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 dark:border-slate-700">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-slate-700">
                    {formatDate(user.created_at)}
                  </td>
                  
                  {/* Activity */}
                  <td className="px-3 py-2 text-center font-semibold border-r border-gray-200 dark:border-slate-700">
                    {user.current_streak > 0 ? (
                      <span className="text-orange-600">{user.current_streak}🔥</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-slate-700">
                    {formatDate(user.last_activity_date)}
                  </td>
                  
                  {/* Status */}
                  <td className="px-3 py-2 text-center border-r border-gray-200 dark:border-slate-700">
                    {getStatusBadge(user.status)}
                  </td>
                  
                  {/* Quiz Performance */}
                  <td className={`px-3 py-2 text-center font-medium border-r border-gray-200 dark:border-slate-700 ${getProgressColor(user.quizAccuracy)}`}>
                    {user.totalQuizAttempts > 0 ? `${user.quizAccuracy}%` : '-'}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-700">
                    <span className={user.questionsAttempted === user.totalQuestions ? 'text-green-700 font-semibold' : ''}>
                      {user.questionsAttempted}
                    </span>
                    <span className="text-gray-400">/{user.totalQuestions}</span>
                  </td>
                  
                  {/* Overall Progress */}
                  <td className={`px-3 py-2 text-center font-semibold border-r border-gray-200 ${getProgressColor(user.overallProgress)}`}>
                    {user.overallProgress}%
                  </td>
                  
                  <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-700">
                    <span className={user.videosCompleted + user.quizzesCompleted + user.documentsCompleted === totalContentItems ? 'text-green-700 font-semibold' : 'font-medium'}>
                      {user.videosCompleted + user.quizzesCompleted + user.documentsCompleted}
                    </span>
                    <span className="text-gray-400">/{totalContentItems}</span>
                  </td>
                  
                  {/* Content Breakdown */}
                  <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-700">
                    <span className={user.videosCompleted === user.videosTotal ? 'text-green-700 font-semibold' : ''}>
                      {user.videosCompleted}
                    </span>
                    <span className="text-gray-400">/{user.videosTotal}</span>
                  </td>
                  <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-700">
                    <span className={user.quizzesCompleted === user.quizzesTotal ? 'text-green-700 font-semibold' : ''}>
                      {user.quizzesCompleted}
                    </span>
                    <span className="text-gray-400">/{user.quizzesTotal}</span>
                  </td>
                  <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-700">
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
                  <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-slate-700">
                    {totalAttempts}
                  </td>
                  <td className={`px-3 py-2 text-center font-medium border-r border-gray-200 ${getProgressColor(avgScore)}`}>
                    {avgScore > 0 ? `${avgScore}%` : '-'}
                  </td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400 whitespace-nowrap border-r border-gray-200 dark:border-slate-700">
                    {new Date(user.created_at).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap border-r border-gray-200 dark:border-slate-700">
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

