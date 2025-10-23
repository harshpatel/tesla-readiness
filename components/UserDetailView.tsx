'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'student' | 'admin' | 'master_admin';
  created_at: string;
}

interface SectionProgress {
  id: string;
  user_id: string;
  section_id: string;
  section_key: string;
  total_questions: number;
  mastered_questions: number;
  questions_for_review: number;
  completed: boolean;
  last_activity_at: string;
}

interface QuestionProgress {
  id: string;
  user_id: string;
  question_id: string;
  section_key: string;
  easiness_factor: number;
  repetitions: number;
  interval_days: number;
  next_review_date: string;
  correct_attempts: number;
  incorrect_attempts: number;
  mastered: boolean;
  last_attempt_date: string;
  created_at: string;
}

interface QuizQuestion {
  id: string;
  question_id: string;
  section_id: string;
  question_type: string;
  question_text: string;
  answers: { [key: string]: string };
  correct_answer: string;
  points: number;
  order_index: number;
}

interface QuizSection {
  id: string;
  key: string;
  title: string;
  icon: string | null;
}

interface UserDetailViewProps {
  userProfile: UserProfile;
  sectionProgress: SectionProgress[];
  questionProgress: QuestionProgress[];
  allQuestions: QuizQuestion[];
  allSections: QuizSection[];
  totalQuestions: number;
}

export default function UserDetailView({
  userProfile,
  sectionProgress,
  questionProgress,
  allQuestions,
  allSections,
  totalQuestions,
}: UserDetailViewProps) {
  const [filterSection, setFilterSection] = useState<string>('all');
  const [filterResult, setFilterResult] = useState<string>('all'); // 'all', 'correct', 'incorrect'
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate overall stats
  const totalMastered = sectionProgress.reduce((sum, p) => sum + p.mastered_questions, 0);
  const progressPercentage = totalQuestions > 0 ? Math.round((totalMastered / totalQuestions) * 100) : 0;
  const totalAttempts = questionProgress.reduce((sum, p) => sum + p.correct_attempts + p.incorrect_attempts, 0);
  const totalCorrect = questionProgress.reduce((sum, p) => sum + p.correct_attempts, 0);
  const totalIncorrect = questionProgress.reduce((sum, p) => sum + p.incorrect_attempts, 0);
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Role badge styling
  const roleColors = {
    master_admin: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Master Admin' },
    admin: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Admin' },
    student: { bg: 'bg-green-100', text: 'text-green-800', label: 'Student' },
  };
  const roleStyle = roleColors[userProfile.role];

  // Create a map of section_key to section details
  const sectionMap = useMemo(() => {
    const map: { [key: string]: QuizSection } = {};
    allSections.forEach((section) => {
      map[section.key] = section;
    });
    return map;
  }, [allSections]);

  // Create a map of question_id to question details
  const questionMap = useMemo(() => {
    const map: { [key: string]: QuizQuestion } = {};
    allQuestions.forEach((question) => {
      map[question.question_id] = question;
    });
    return map;
  }, [allQuestions]);

  // Filter and search question progress
  const filteredQuestionProgress = useMemo(() => {
    return questionProgress.filter((progress) => {
      // Filter by section
      if (filterSection !== 'all' && progress.section_key !== filterSection) {
        return false;
      }

      // Filter by result
      if (filterResult === 'correct' && !progress.mastered) {
        return false;
      }
      if (filterResult === 'incorrect' && progress.mastered) {
        return false;
      }

      // Search by question text
      if (searchQuery) {
        const question = questionMap[progress.question_id];
        if (!question) return false;
        const queryLower = searchQuery.toLowerCase();
        return question.question_text.toLowerCase().includes(queryLower);
      }

      return true;
    });
  }, [questionProgress, filterSection, filterResult, searchQuery, questionMap]);

  // Group by date
  const groupedByDate = useMemo(() => {
    const groups: { [date: string]: QuestionProgress[] } = {};
    filteredQuestionProgress.forEach((progress) => {
      const date = new Date(progress.last_attempt_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(progress);
    });
    return groups;
  }, [filteredQuestionProgress]);

  const dateKeys = Object.keys(groupedByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* User Profile Header */}
      <div className="mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm animate-[fadeIn_0.6s_ease-out]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {userProfile.full_name?.charAt(0) || userProfile.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1a1a1a]">
                {userProfile.full_name || 'Anonymous'}
              </h1>
              <p className="text-gray-600">{userProfile.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}>
                  {roleStyle.label}
                </span>
                <span className="text-sm text-gray-500">
                  Joined {new Date(userProfile.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 text-sm font-medium text-[#0A84FF] hover:text-[#0077ED] transition-colors"
          >
            ← Back to Admin
          </Link>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Questions Mastered', value: `${totalMastered}/${totalQuestions}`, emoji: '✅', color: '#34C759' },
          { label: 'Overall Progress', value: `${progressPercentage}%`, emoji: '📊', color: '#0A84FF' },
          { label: 'Total Attempts', value: totalAttempts, emoji: '🎯', color: '#FF9500' },
          { label: 'Accuracy', value: `${accuracy}%`, emoji: '💯', color: '#5856D6' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="p-6 rounded-xl border border-gray-200 bg-white"
            style={{
              animation: `fadeIn 0.6s ease-out ${0.1 + index * 0.05}s backwards`,
            }}
          >
            <div className="text-2xl mb-2">{stat.emoji}</div>
            <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Section Progress Breakdown */}
      <div className="mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Section Progress</h2>
        <div className="space-y-4">
          {sectionProgress.map((section) => {
            const sectionDetails = sectionMap[section.section_key];
            const sectionPercentage = section.total_questions > 0
              ? Math.round((section.mastered_questions / section.total_questions) * 100)
              : 0;

            return (
              <div key={section.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sectionDetails?.icon || '📚'}</span>
                    <span className="font-semibold text-[#1a1a1a]">
                      {sectionDetails?.title || section.section_key}
                    </span>
                    {section.completed && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        ✓ Complete
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">
                    {section.mastered_questions}/{section.total_questions} mastered ({sectionPercentage}%)
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-[#0A84FF] to-[#0077ED] h-2.5 rounded-full transition-all"
                    style={{ width: `${sectionPercentage}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Last activity: {new Date(section.last_activity_at).toLocaleString()}
                </div>
              </div>
            );
          })}
          {sectionProgress.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No quiz activity yet
            </div>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">Activity Timeline</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Section Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Section
            </label>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
            >
              <option value="all">All Sections</option>
              {allSections.map((section) => (
                <option key={section.id} value={section.key}>
                  {section.icon} {section.title}
                </option>
              ))}
            </select>
          </div>

          {/* Result Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Result
            </label>
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
            >
              <option value="all">All Results</option>
              <option value="correct">✅ Mastered</option>
              <option value="incorrect">🔄 In Progress</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Questions
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by question text..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent"
            />
          </div>
        </div>
        {filteredQuestionProgress.length < questionProgress.length && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredQuestionProgress.length} of {questionProgress.length} activities
          </div>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="space-y-6">
        {dateKeys.map((dateKey) => (
          <div key={dateKey} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#0A84FF] to-[#0077ED] text-white px-6 py-3">
              <h3 className="text-lg font-bold">{dateKey}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {groupedByDate[dateKey].map((progress) => {
                const question = questionMap[progress.question_id];
                const section = sectionMap[progress.section_key];
                
                if (!question) return null;

                return (
                  <div key={progress.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                        progress.mastered 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {progress.mastered ? '✅' : '🔄'}
                      </div>

                      {/* Question Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-[#0A84FF]">
                            {section?.icon} {section?.title || progress.section_key}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {new Date(progress.last_attempt_date).toLocaleTimeString()}
                          </span>
                        </div>

                        <h4 className="text-lg font-semibold text-[#1a1a1a] mb-3">
                          {question.question_text}
                        </h4>

                        {/* Answer Options */}
                        <div className="grid gap-2 mb-4">
                          {Object.entries(question.answers).map(([key, value]) => {
                            const isCorrect = key === question.correct_answer;
                            return (
                              <div
                                key={key}
                                className={`p-3 rounded-lg text-sm ${
                                  isCorrect
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-gray-50 border border-gray-200'
                                }`}
                              >
                                <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-gray-700'}`}>
                                  {key}.
                                </span>{' '}
                                <span className={isCorrect ? 'text-green-600' : 'text-gray-600'}>
                                  {value}
                                </span>
                                {isCorrect && (
                                  <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                                    ✓ Correct Answer
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Performance Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Status</div>
                            <div className="text-sm font-semibold">
                              {progress.mastered ? (
                                <span className="text-green-600">✅ Mastered</span>
                              ) : (
                                <span className="text-yellow-600">🔄 In Progress</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Correct</div>
                            <div className="text-sm font-semibold text-green-600">
                              {progress.correct_attempts}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Incorrect</div>
                            <div className="text-sm font-semibold text-red-600">
                              {progress.incorrect_attempts}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Ease Factor</div>
                            <div className="text-sm font-semibold text-[#0A84FF]">
                              {progress.easiness_factor.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Next Review</div>
                            <div className="text-sm font-semibold text-purple-600">
                              {progress.interval_days}d
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {questionProgress.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-600">No quiz activity yet</p>
          </div>
        )}

        {questionProgress.length > 0 && filteredQuestionProgress.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-600">No activities match your filters</p>
            <button
              onClick={() => {
                setFilterSection('all');
                setFilterResult('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0077ED] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

