'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminQuizPreview from './AdminQuizPreview';

interface AdminQuizzesClientProps {
  quizzes: any[];
  questionsBySection: Record<string, any[]>;
  quizFileNumbers: Record<string, string>;
  userEmail?: string;
}

interface ModalContent {
  type: 'hint' | 'explanation';
  content: string;
  questionText: string;
}

export default function AdminQuizzesClient({ 
  quizzes, 
  questionsBySection, 
  quizFileNumbers
}: AdminQuizzesClientProps) {
  const [hintsBySection, setHintsBySection] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [expandedQuizzes, setExpandedQuizzes] = useState<Set<string>>(new Set());
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const [previewQuiz, setPreviewQuiz] = useState<any>(null);

  useEffect(() => {
    async function loadHints() {
      console.log('🔍 Loading hints for quizzes:', quizzes.map(q => q.slug));
      const hints: Record<string, any> = {};
      
      for (const quiz of quizzes) {
        const fileNumber = quizFileNumbers[quiz.slug];
        const fileName = fileNumber ? `${fileNumber}-${quiz.slug}.json` : `${quiz.slug}.json`;
        
        console.log(`📄 Fetching: /data/quiz-hints/${fileName}`);
        
        try {
          const hintsResponse = await fetch(`/data/quiz-hints/${fileName}`, {
            cache: 'no-store'
          });
          
          console.log(`  Response status: ${hintsResponse.status} for ${fileName}`);
          
          if (hintsResponse.ok) {
            const data = await hintsResponse.json();
            hints[quiz.slug] = data;
            console.log(`  ✅ Loaded ${Object.keys(data).length} hints for ${quiz.slug}`);
          } else {
            console.log(`  ❌ Failed to load ${fileName}: ${hintsResponse.status}`);
          }
        } catch (error) {
          console.log(`  ❌ Error loading ${fileName}:`, error);
        }
      }
      
      console.log('📊 Total hints loaded:', Object.keys(hints).length, 'quizzes');
      setHintsBySection(hints);
      setLoading(false);
    }

    loadHints();
  }, [quizzes, quizFileNumbers]);

  const toggleQuiz = (slug: string) => {
    const newExpanded = new Set(expandedQuizzes);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedQuizzes(newExpanded);
  };

  const openModal = (type: 'hint' | 'explanation', content: string, questionText: string) => {
    setModalContent({ type, content, questionText });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#f5f7fa] via-[#f8f9fa] to-[#fafbfc] dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="text-center animate-[fadeIn_0.4s_ease-out]">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#e0e0e0] border-t-[#0A84FF] mx-auto mb-6"></div>
          <p className="text-[15px] text-[#666] dark:text-gray-400 font-medium">Loading quiz data...</p>
        </div>
      </div>
    );
  }

  // Sort quizzes by file number (01-10)
  const sortedQuizzes = [...quizzes].sort((a, b) => {
    const numA = parseInt(quizFileNumbers[a.slug] || '999');
    const numB = parseInt(quizFileNumbers[b.slug] || '999');
    return numA - numB;
  });

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-[#f5f7fa] via-[#f8f9fa] to-[#fafbfc] dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto animate-[fadeIn_0.4s_ease-out]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-[#1a1a1a] dark:text-white mb-2 tracking-tight leading-tight">Quiz Source of Truth</h1>
            <p className="text-[15px] text-[#666] dark:text-gray-400 font-medium">
              Database questions + JSON hints/explanations
            </p>
          </div>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gradient-to-br from-[#0A84FF] to-[#0077ED] text-white rounded-[8px] text-[14px] font-semibold transition-all duration-300 hover:shadow-[0_4px_16px_rgba(10,132,255,0.3)] hover:-translate-y-[2px] active:translate-y-0"
          >
            ← Back to Admin
          </Link>
        </div>

        {/* Quiz List */}
        <div className="space-y-4">
          {sortedQuizzes.map((quiz) => {
            const questions = questionsBySection[quiz.slug] || [];
            const hints = hintsBySection[quiz.slug] || {};
            const fileNumber = quizFileNumbers[quiz.slug];
            const isExpanded = expandedQuizzes.has(quiz.slug);
            
            return (
              <div key={quiz.id} className="bg-white dark:bg-slate-800 rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#e0e0e0] dark:border-slate-700 overflow-hidden group hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300">
                {/* Quiz Header - Clickable */}
                <div className="w-full bg-gradient-to-b from-[#f0f8ff] to-white dark:from-slate-700 dark:to-slate-800 px-6 py-5 border-b border-[#e0e0e0] dark:border-slate-700 hover:from-[#e8f4ff] hover:to-[#f8faff] dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all duration-300 rounded-t-[12px]">
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => toggleQuiz(quiz.slug)}
                      className="text-left flex-1"
                    >
                      <div className="flex items-center gap-3">
                        <h2 className="text-[20px] font-bold text-[#1a1a1a] dark:text-white tracking-tight">
                          {fileNumber && <span className="text-[#0A84FF]">{fileNumber}.</span>} {quiz.title}
                        </h2>
                        <span className="text-[#ccc] text-sm transition-colors group-hover:text-[#0A84FF]">
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#666] dark:text-gray-400 mt-2 font-medium">
                        {quiz.module.section.title} → {quiz.module.title}
                      </p>
                      <div className="flex gap-6 mt-3 text-[13px]">
                        <span className="text-[#666] dark:text-gray-400 font-medium">
                          <strong className="text-[#1a1a1a] dark:text-white">DB Questions:</strong> {questions.length}
                        </span>
                        <span className="text-[#666] dark:text-gray-400 font-medium">
                          <strong className="text-[#1a1a1a] dark:text-white">JSON Hints:</strong> {Object.keys(hints).length}
                        </span>
                        <span className={`font-semibold ${questions.length === Object.keys(hints).length ? 'text-[#34C759]' : 'text-[#FF3B30]'}`}>
                          {questions.length === Object.keys(hints).length ? '✓ Synced' : '⚠️ Mismatch'}
                        </span>
                      </div>
                    </button>
                    <div className="text-right flex flex-col items-end gap-2">
                      <button
                        onClick={() => setPreviewQuiz(quiz)}
                        className="px-4 py-2 bg-gradient-to-br from-[#0A84FF] to-[#0077ED] text-white text-[13px] font-semibold rounded-[8px] transition-all duration-300 opacity-0 group-hover:opacity-100 hover:shadow-[0_4px_12px_rgba(10,132,255,0.3)] hover:-translate-y-[2px] active:translate-y-0"
                      >
                        👁️ Preview Quiz
                      </button>
                      <code className="text-[11px] bg-[#f0f0f0] dark:bg-slate-700 text-[#666] dark:text-gray-300 px-2 py-1 rounded-[4px] font-medium">
                        slug: {quiz.slug}
                      </code>
                      <code className="text-[11px] bg-[#f0f8ff] text-[#0A84FF] px-2 py-1 rounded-[4px] font-medium border border-[#e0f0ff]">
                        file: {fileNumber}-{quiz.slug}.json
                      </code>
                    </div>
                  </div>
                </div>

                {/* Questions List - Collapsible */}
                {isExpanded && (
                  <div className="p-6 bg-gradient-to-b from-[#fafbfc] to-white dark:from-slate-800 dark:to-slate-900">
                  <div className="space-y-3">
                    {questions.map((q: any, idx: number) => {
                      const hintData = hints[q.question_id];
                      const hasHint = hintData?.hint && hintData.hint.length > 0;
                      const hasExplanation = hintData?.explanation && hintData.explanation.length > 0;
                      
                      return (
                        <div 
                          key={q.id} 
                          className="border border-[#e0e0e0] dark:border-slate-700 rounded-[12px] p-5 bg-white dark:bg-slate-800 hover:border-[#0A84FF] hover:shadow-[0_2px_8px_rgba(10,132,255,0.1)] transition-all duration-300"
                        >
                          {/* Question Header */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#f0f8ff] to-[#e8f4ff] dark:from-blue-900/30 dark:to-blue-800/30 text-[#0A84FF] dark:text-blue-400 font-bold rounded-full flex items-center justify-center text-[14px] border border-[#e0f0ff] dark:border-slate-600">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <code className="text-[11px] bg-[#f0f0f0] dark:bg-slate-700 text-[#666] dark:text-gray-300 px-2 py-1 rounded-[4px] font-semibold uppercase tracking-wide">
                                  {q.question_id}
                                </code>
                                <span className="text-[11px] text-[#666] dark:text-gray-400 uppercase font-semibold tracking-wide">
                                  {q.question_type}
                                </span>
                              </div>
                              <p className="font-semibold text-[15px] text-[#1a1a1a] dark:text-white leading-relaxed">{q.question_text}</p>
                              
                              {/* Answers */}
                              <div className="mt-3 grid grid-cols-2 gap-2">
                                {Object.entries(q.answers as Record<string, string>).map(([key, value]) => (
                                  <div
                                    key={key}
                                    className={`text-[14px] px-3 py-2 rounded-[8px] ${
                                      key === q.correct_answer
                                        ? 'bg-gradient-to-br from-[#d5f4e6] to-[#b8e5d2] dark:from-green-900/30 dark:to-green-800/30 border border-[#58d68d] dark:border-green-700 text-[#1a1a1a] dark:text-white font-semibold shadow-[0_2px_4px_rgba(88,214,141,0.2)]'
                                        : 'bg-[#f8f9fa] dark:bg-slate-700 border border-[#e0e0e0] dark:border-slate-600 text-[#666] dark:text-gray-300 font-medium'
                                    }`}
                                  >
                                    <strong className="text-[#1a1a1a] dark:text-white">{key}:</strong> {value}
                                  </div>
                                ))}
                              </div>

                              {/* Image URL if exists */}
                              {q.image_url && (
                                <div className="mt-3">
                                  <span className="text-[11px] text-[#5856D6] font-semibold uppercase tracking-wide bg-[#f3f2ff] px-2 py-1 rounded-[4px] border border-[#e8e7ff]">🖼️ Has Image</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Hint & Explanation Status */}
                          <div className="mt-4 pt-4 border-t border-[#f0f0f0]">
                            <div className="grid grid-cols-2 gap-4">
                              {/* Hint */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[11px] font-semibold text-[#666] dark:text-gray-400 uppercase tracking-wide">💡 Hint</span>
                                  <span className={`text-[11px] px-2 py-0.5 rounded-[4px] font-semibold uppercase tracking-wide ${hasHint ? 'bg-[#d5f4e6] text-[#28a745]' : 'bg-[#ffe5e5] text-[#ff3b30]'}`}>
                                    {hasHint ? '✓ Has' : '✗ Missing'}
                                  </span>
                                </div>
                                {hasHint && (
                                  <button
                                    onClick={() => openModal('hint', hintData.hint, q.question_text)}
                                    className="text-[13px] text-[#666] dark:text-gray-300 bg-gradient-to-br from-[#fff3e0] to-[#ffe8cc] dark:from-orange-900/20 dark:to-orange-800/20 p-3 rounded-[8px] border border-[#ffd699] dark:border-orange-800 line-clamp-2 w-full text-left hover:shadow-[0_2px_8px_rgba(255,149,0,0.2)] hover:-translate-y-[1px] transition-all duration-300 font-medium"
                                  >
                                    {hintData.hint}
                                  </button>
                                )}
                              </div>

                              {/* Explanation */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[11px] font-semibold text-[#666] dark:text-gray-400 uppercase tracking-wide">📚 Explanation</span>
                                  <span className={`text-[11px] px-2 py-0.5 rounded-[4px] font-semibold uppercase tracking-wide ${hasExplanation ? 'bg-[#d5f4e6] text-[#28a745]' : 'bg-[#ffe5e5] text-[#ff3b30]'}`}>
                                    {hasExplanation ? '✓ Has' : '✗ Missing'}
                                  </span>
                                </div>
                                {hasExplanation && (
                                  <button
                                    onClick={() => openModal('explanation', hintData.explanation, q.question_text)}
                                    className="text-[13px] text-[#666] dark:text-gray-300 bg-gradient-to-br from-[#f0f8ff] to-[#e0f0ff] dark:from-blue-900/20 dark:to-blue-800/20 p-3 rounded-[8px] border border-[#b3d9ff] dark:border-blue-800 line-clamp-2 w-full text-left hover:shadow-[0_2px_8px_rgba(10,132,255,0.2)] hover:-translate-y-[1px] transition-all duration-300 font-medium"
                                  >
                                    {hintData.explanation.substring(0, 100)}...
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {questions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No questions found in database for this quiz
                    </div>
                  )}
                </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[#e0e0e0] dark:border-slate-700 p-8 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300">
          <h3 className="text-[20px] font-bold text-[#1a1a1a] dark:text-white mb-6 tracking-tight">📊 Summary Statistics</h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-[32px] font-bold text-[#0A84FF] tracking-tight">
                {quizzes.length}
              </div>
              <div className="text-[13px] text-[#666] font-semibold mt-2 uppercase tracking-wide">Total Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-[32px] font-bold text-[#34C759] tracking-tight">
                {Object.values(questionsBySection).reduce((acc, questions) => acc + questions.length, 0)}
              </div>
              <div className="text-[13px] text-[#666] font-semibold mt-2 uppercase tracking-wide">Total Questions (DB)</div>
            </div>
            <div className="text-center">
              <div className="text-[32px] font-bold text-[#FF9500] tracking-tight">
                {Object.values(hintsBySection).reduce((acc, hints) => acc + Object.keys(hints).length, 0)}
              </div>
              <div className="text-[13px] text-[#666] font-semibold mt-2 uppercase tracking-wide">Total Hints (JSON)</div>
            </div>
            <div className="text-center">
              <div className="text-[32px] font-bold text-[#5856D6] tracking-tight">
                {Object.values(questionsBySection).reduce((acc, questions) => 
                  acc + questions.filter((q: any) => q.image_url).length, 0
                )}
              </div>
              <div className="text-[13px] text-[#666] font-semibold mt-2 uppercase tracking-wide">Questions with Images</div>
            </div>
          </div>
        </div>

        {/* Modal for Hint/Explanation - TeslaMR Design System */}
        {modalContent && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-[8px] flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]"
            onClick={closeModal}
          >
            <div 
              className="bg-white dark:bg-slate-800 rounded-[16px] shadow-[0_12px_48px_rgba(0,0,0,0.3)] max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-[slideUp_0.4s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`px-8 py-6 border-b border-[#e0e0e0] dark:border-slate-700 ${modalContent.type === 'hint' ? 'bg-gradient-to-b from-[#fff3e0] to-[#ffe8cc] dark:from-orange-900/30 dark:to-orange-800/30' : 'bg-gradient-to-b from-[#f0f8ff] to-[#e0f0ff] dark:from-blue-900/30 dark:to-blue-800/30'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-[24px] font-bold text-[#1a1a1a] dark:text-white mb-2 tracking-tight">
                      {modalContent.type === 'hint' ? '💡 Hint' : '📚 Explanation'}
                    </h3>
                    <p className="text-[14px] text-[#666] italic font-medium">
                      &ldquo;{modalContent.questionText}&rdquo;
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="ml-4 text-[#ccc] hover:text-[#666] transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto flex-1">
                <div className={`bg-gradient-to-br ${modalContent.type === 'hint' ? 'from-[#fff3e0] to-[#ffe8cc] dark:from-orange-900/20 dark:to-orange-800/20 border-[#ffd699] dark:border-orange-800' : 'from-[#f0f8ff] to-[#e0f0ff] dark:from-blue-900/20 dark:to-blue-800/20 border-[#b3d9ff] dark:border-blue-800'} p-6 rounded-[12px] border-2`}>
                  <pre className="whitespace-pre-wrap font-sans text-[15px] text-[#1a1a1a] dark:text-white leading-relaxed">
{modalContent.content}
                  </pre>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-gradient-to-b from-white to-[#fafbfc] dark:from-slate-800 dark:to-slate-900 border-t border-[#e0e0e0] dark:border-slate-700">
                <button
                  onClick={closeModal}
                  className="w-full px-6 py-3 bg-gradient-to-br from-[#0A84FF] to-[#0077ED] text-white rounded-[8px] text-[16px] font-semibold transition-all duration-300 hover:shadow-[0_4px_16px_rgba(10,132,255,0.3)] hover:-translate-y-[2px] active:translate-y-0"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Quiz Modal */}
        {previewQuiz && (
          <AdminQuizPreview
            quiz={previewQuiz}
            questions={questionsBySection[previewQuiz.slug] || []}
            hints={hintsBySection[previewQuiz.slug] || {}}
            onClose={() => setPreviewQuiz(null)}
          />
        )}
      </div>
    </div>
  );
}

