'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface UserProfile {
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
  slug: string;
  title: string;
  type: string;
  icon: string;
  order_index: number;
}

interface ModuleProgress {
  user_id: string;
  module_id: string;
  total_items: number;
  completed_items: number;
  progress_percent: number;
  last_accessed_at: string | null;
}

interface ContentProgress {
  user_id: string;
  content_item_id: string;
  completed: boolean;
  score: number | null;
  attempts: number;
  time_spent_seconds: number;
  last_accessed_at: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface SectionProgress {
  user_id: string;
  section_id: string;
  total_modules: number;
  completed_modules: number;
  progress_percent: number;
  last_accessed_at: string | null;
}

interface UserDetailViewProps {
  userProfile: UserProfile;
  sections: Section[];
  modules: Module[];
  contentItems: ContentItem[];
  moduleProgress: ModuleProgress[];
  contentProgress: ContentProgress[];
  sectionProgress: SectionProgress[];
}

export default function UserDetailView({
  userProfile,
  sections,
  modules,
  contentItems,
  moduleProgress,
  contentProgress,
  sectionProgress,
}: UserDetailViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(sections.map(s => s.id)));

  // Calculate overall stats
  const overallProgress = sectionProgress.length > 0
    ? Math.round(sectionProgress.reduce((sum, sp) => sum + sp.progress_percent, 0) / sectionProgress.length)
    : 0;

  const totalContentItems = contentItems.length;
  const completedContentItems = contentProgress.filter(cp => cp.completed).length;
  
  const videoItems = contentItems.filter(ci => ci.type === 'video');
  const quizItems = contentItems.filter(ci => ci.type === 'quiz');
  const documentItems = contentItems.filter(ci => ci.type === 'document');
  
  const completedContentIds = new Set(contentProgress.filter(cp => cp.completed).map(cp => cp.content_item_id));
  
  const videosCompleted = videoItems.filter(vi => completedContentIds.has(vi.id)).length;
  const quizzesCompleted = quizItems.filter(qi => completedContentIds.has(qi.id)).length;
  const documentsCompleted = documentItems.filter(di => completedContentIds.has(di.id)).length;

  const totalAttempts = contentProgress.reduce((sum, cp) => sum + cp.attempts, 0);
  const avgScore = contentProgress.filter(cp => cp.score !== null).length > 0
    ? Math.round(contentProgress.filter(cp => cp.score !== null).reduce((sum, cp) => sum + (cp.score || 0), 0) / contentProgress.filter(cp => cp.score !== null).length)
    : 0;

  // Role badge styling
  const roleColors = {
    master_admin: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', label: 'Master Admin' },
    admin: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', label: 'Admin' },
    student: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label: 'Student' },
  };
  const roleStyle = roleColors[userProfile.role];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return 'text-green-700 font-semibold';
    if (percent >= 50) return 'text-blue-700 font-medium';
    if (percent >= 20) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getProgressBg = (percent: number) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 50) return 'bg-blue-500';
    if (percent >= 20) return 'bg-orange-500';
    return 'bg-gray-400';
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Compact User Header */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold">
              {(userProfile.first_name || userProfile.full_name || userProfile.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {userProfile.first_name && userProfile.last_name 
                  ? `${userProfile.first_name} ${userProfile.last_name}` 
                  : userProfile.full_name || userProfile.email}
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{userProfile.email}</span>
                {userProfile.phone && (
                  <>
                    <span>•</span>
                    <span>{userProfile.phone}</span>
                  </>
                )}
                {userProfile.date_of_birth && (
                  <>
                    <span>•</span>
                    <span>DOB: {formatDate(userProfile.date_of_birth)}</span>
                  </>
                )}
              </div>
            </div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
              {roleStyle.label}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-gray-500">Joined:</span>
              <span className="ml-1 font-medium">{formatDate(userProfile.created_at)}</span>
            </div>
            <div>
              <span className="text-gray-500">Streak:</span>
              <span className="ml-1 font-semibold text-orange-600">{userProfile.current_streak}🔥</span>
            </div>
            <div>
              <span className="text-gray-500">Last Active:</span>
              <span className="ml-1 font-medium">{formatDate(userProfile.last_activity_date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Stats Grid */}
      <div className="grid grid-cols-6 gap-2 mb-4">
        {[
          { label: 'Overall', value: `${overallProgress}%`, color: getProgressColor(overallProgress) },
          { label: 'Items Completed', value: `${completedContentItems}/${totalContentItems}`, color: 'text-gray-700' },
          { label: 'Videos', value: `${videosCompleted}/${videoItems.length}`, color: videosCompleted === videoItems.length ? 'text-green-700 font-semibold' : 'text-gray-700' },
          { label: 'Quizzes', value: `${quizzesCompleted}/${quizItems.length}`, color: quizzesCompleted === quizItems.length ? 'text-green-700 font-semibold' : 'text-gray-700' },
          { label: 'Documents', value: `${documentsCompleted}/${documentItems.length}`, color: documentsCompleted === documentItems.length ? 'text-green-700 font-semibold' : 'text-gray-700' },
          { label: 'Avg Score', value: `${avgScore}%`, color: getProgressColor(avgScore) },
        ].map((stat, index) => (
          <div key={stat.label} className="p-2 bg-white rounded border border-gray-200">
            <div className="text-xs text-gray-600 mb-0.5">{stat.label}</div>
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Detailed Progress Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-900">Detailed Progress Breakdown</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 border-b-2 border-gray-400 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap w-10 border-r border-gray-300"></th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">Section / Module / Content</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">Type</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">Status</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-blue-50">Progress %</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-green-50">Score %</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">Attempts</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">Items Completed</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">Items Total</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-orange-50">Time Spent (min)</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-gray-100">Created</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-gray-100">Last Accessed</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-gray-100">Completed At</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300 bg-gray-100">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, sectionIdx) => {
                const sectionProg = sectionProgress.find(sp => sp.section_id === section.id);
                const sectionModules = modules.filter(m => m.section_id === section.id).sort((a, b) => a.order_index - b.order_index);
                const isExpanded = expandedSections.has(section.id);
                
                return (
                  <React.Fragment key={section.id}>
                    {/* Section Row */}
                    <tr 
                      className={`${sectionIdx % 2 === 0 ? 'bg-blue-50' : 'bg-blue-100'} hover:bg-blue-200 cursor-pointer border-t-2 border-gray-300`}
                      onClick={() => toggleSection(section.id)}
                    >
                      <td className="px-3 py-2 text-center border-r border-gray-300">
                        <span className="text-gray-700 font-bold">{isExpanded ? '▼' : '▶'}</span>
                      </td>
                      <td className="px-3 py-2 font-bold text-gray-900 border-r border-gray-300">
                        <span className="mr-2">{section.icon}</span>
                        {section.title}
                      </td>
                      <td className="px-3 py-2 text-center text-gray-600 font-medium border-r border-gray-300">Section</td>
                      <td className="px-3 py-2 text-center border-r border-gray-300">
                        {sectionProg && sectionProg.completed_modules === sectionProg.total_modules ? (
                          <span className="text-green-700 font-semibold">✓ Complete</span>
                        ) : (
                          <span className="text-blue-600">{sectionProg?.completed_modules || 0}/{sectionProg?.total_modules || 0}</span>
                        )}
                      </td>
                      <td className={`px-3 py-2 text-center font-semibold border-r border-gray-300 ${getProgressColor(sectionProg?.progress_percent || 0)}`}>
                        {sectionProg?.progress_percent || 0}%
                      </td>
                      <td className="px-3 py-2 text-center text-gray-400 border-r border-gray-300">-</td>
                      <td className="px-3 py-2 text-center text-gray-400 border-r border-gray-300">-</td>
                      <td className="px-3 py-2 text-center font-medium border-r border-gray-300">{sectionProg?.completed_modules || 0}</td>
                      <td className="px-3 py-2 text-center font-medium border-r border-gray-300">{sectionProg?.total_modules || 0}</td>
                      <td className="px-3 py-2 text-center text-gray-400 border-r border-gray-300">-</td>
                      <td className="px-3 py-2 text-gray-400 border-r border-gray-300">-</td>
                      <td className="px-3 py-2 text-gray-600 border-r border-gray-300">{formatDateTime(sectionProg?.last_accessed_at || null)}</td>
                      <td className="px-3 py-2 text-gray-400 border-r border-gray-300">-</td>
                      <td className="px-3 py-2 text-gray-400 border-r border-gray-300">-</td>
                    </tr>

                    {/* Module Rows (if expanded) */}
                    {isExpanded && sectionModules.map((module, moduleIdx) => {
                      const moduleProg = moduleProgress.find(mp => mp.module_id === module.id);
                      const moduleContent = contentItems.filter(ci => ci.module_id === module.id).sort((a, b) => a.order_index - b.order_index);
                      
                      return (
                        <React.Fragment key={module.id}>
                          {/* Module Row */}
                          <tr className={`${sectionIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-yellow-50 border-b border-gray-200`}>
                            <td className="px-3 py-2 border-r border-gray-300"></td>
                            <td className="px-3 py-2 pl-6 font-semibold text-gray-800 border-r border-gray-300">
                              <span className="mr-2">{module.icon}</span>
                              {module.title}
                            </td>
                            <td className="px-3 py-2 text-center text-gray-600 border-r border-gray-300">Module</td>
                            <td className="px-3 py-2 text-center border-r border-gray-300">
                              {moduleProg && moduleProg.completed_items === moduleProg.total_items ? (
                                <span className="text-green-700 font-semibold">✓ Complete</span>
                              ) : (
                                <span className="text-orange-600">{moduleProg?.completed_items || 0}/{moduleProg?.total_items || 0}</span>
                              )}
                            </td>
                            <td className={`px-3 py-2 text-center font-medium border-r border-gray-300 ${getProgressColor(moduleProg?.progress_percent || 0)}`}>
                              {moduleProg?.progress_percent || 0}%
                            </td>
                            <td className="px-3 py-2 text-center text-gray-400 border-r border-gray-300">-</td>
                            <td className="px-3 py-2 text-center text-gray-400 border-r border-gray-300">-</td>
                            <td className="px-3 py-2 text-center font-medium border-r border-gray-300">{moduleProg?.completed_items || 0}</td>
                            <td className="px-3 py-2 text-center font-medium border-r border-gray-300">{moduleProg?.total_items || 0}</td>
                            <td className="px-3 py-2 text-center text-gray-400 border-r border-gray-300">-</td>
                            <td className="px-3 py-2 text-gray-400 border-r border-gray-300">-</td>
                            <td className="px-3 py-2 text-gray-600 border-r border-gray-300">{formatDateTime(moduleProg?.last_accessed_at || null)}</td>
                            <td className="px-3 py-2 text-gray-400 border-r border-gray-300">-</td>
                            <td className="px-3 py-2 text-gray-400 border-r border-gray-300">-</td>
                          </tr>

                          {/* Content Item Rows */}
                          {moduleContent.map((content) => {
                            const contentProg = contentProgress.find(cp => cp.content_item_id === content.id);
                            
                            return (
                              <tr key={content.id} className={`${sectionIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 border-b border-gray-100`}>
                                <td className="px-3 py-2 border-r border-gray-300"></td>
                                <td className="px-3 py-2 pl-12 text-gray-700 border-r border-gray-300">
                                  <span className="mr-2">{content.icon}</span>
                                  {content.title}
                                </td>
                                <td className="px-3 py-2 text-center border-r border-gray-300">
                                  <span className="inline-block px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                                    {content.type}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-center border-r border-gray-300">
                                  {contentProg?.completed ? (
                                    <span className="text-green-700 font-semibold">✓ Complete</span>
                                  ) : contentProg ? (
                                    <span className="text-yellow-600">In Progress</span>
                                  ) : (
                                    <span className="text-gray-400">Not Started</span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-center font-medium border-r border-gray-300">
                                  {contentProg?.completed ? (
                                    <span className="text-green-700 font-semibold">100%</span>
                                  ) : (
                                    <span className="text-gray-400">0%</span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-center border-r border-gray-300">
                                  {contentProg?.score !== null && contentProg?.score !== undefined ? (
                                    <span className={`font-medium ${getProgressColor(contentProg.score)}`}>
                                      {Math.round(contentProg.score)}%
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-center text-gray-700 border-r border-gray-300">
                                  {contentProg?.attempts || 0}
                                </td>
                                <td className="px-3 py-2 text-center text-gray-400 border-r border-gray-300">-</td>
                                <td className="px-3 py-2 text-center text-gray-400 border-r border-gray-300">-</td>
                                <td className="px-3 py-2 text-center text-gray-600 border-r border-gray-300">
                                  {contentProg?.time_spent_seconds ? Math.round(contentProg.time_spent_seconds / 60) : '-'}
                                </td>
                                <td className="px-3 py-2 text-gray-600 border-r border-gray-300">{formatDateTime(contentProg?.created_at || null)}</td>
                                <td className="px-3 py-2 text-gray-600 border-r border-gray-300">{formatDateTime(contentProg?.last_accessed_at || null)}</td>
                                <td className="px-3 py-2 text-gray-600 border-r border-gray-300">{formatDateTime(contentProg?.completed_at || null)}</td>
                                <td className="px-3 py-2 text-gray-600 border-r border-gray-300">{formatDateTime(contentProg?.updated_at || null)}</td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-4">
        <Link
          href="/admin"
          className="inline-block px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
