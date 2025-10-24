'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface AdminQuizPreviewProps {
  quiz: any;
  questions: any[];
  hints: Record<string, any>;
  onClose: () => void;
}

interface QuestionEdit {
  id: string;
  question_id: string;
  question_text?: string;
  answers?: Record<string, string>;
  correct_answer?: string;
  image_url?: string | null;
  hint?: string;
  explanation?: string;
}

interface SaveResult {
  questionId: string;
  questionText: string;
  dbUpdated: boolean;
  jsonUpdated: boolean;
  fieldsChanged: string[];
}

export default function AdminQuizPreview({ quiz, questions, hints, onClose }: AdminQuizPreviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [edits, setEdits] = useState<Record<string, QuestionEdit>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResults, setSaveResults] = useState<SaveResult[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  const currentHint = hints[currentQuestion?.question_id] || {};
  
  // Merge current question data with any edits
  const editedQuestion = edits[currentQuestion?.id] || {};
  const displayQuestion = {
    ...currentQuestion,
    ...currentHint,
    ...editedQuestion,
  };

  const hasEdits = Object.keys(edits).length > 0;

  const updateEdit = (field: string, value: any) => {
    setEdits(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        id: currentQuestion.id,
        question_id: currentQuestion.question_id,
        [field]: value,
      }
    }));
  };

  const updateAnswer = (key: string, value: string) => {
    const currentAnswers = editedQuestion.answers || currentQuestion.answers;
    updateEdit('answers', {
      ...currentAnswers,
      [key]: value
    });
  };

  const handleSave = async () => {
    setShowConfirmModal(false);
    setIsSaving(true);

    console.log('🚀 Starting save process...');
    console.log('📊 Total edits to save:', Object.keys(edits).length);

    const results: SaveResult[] = [];

    try {
      // Save all edits
      for (const [questionId, edit] of Object.entries(edits)) {
        const question = questions.find(q => q.id === questionId);
        if (!question) {
          console.warn('⚠️ Question not found:', questionId);
          continue;
        }

        console.log(`\n📝 Processing question: ${edit.question_id}`);

        const fieldsChanged: string[] = [];
        let dbUpdated = false;
        let jsonUpdated = false;

        // Prepare DB updates (question data)
        const dbUpdates: any = {};
        if (edit.question_text !== undefined) {
          dbUpdates.question_text = edit.question_text;
          fieldsChanged.push('Question Text');
        }
        if (edit.answers !== undefined) {
          dbUpdates.answers = edit.answers;
          fieldsChanged.push('Answer Choices');
        }
        if (edit.correct_answer !== undefined) {
          dbUpdates.correct_answer = edit.correct_answer;
          fieldsChanged.push('Correct Answer');
        }
        if (edit.image_url !== undefined) {
          dbUpdates.image_url = edit.image_url;
          fieldsChanged.push('Image URL');
        }

        // Prepare JSON updates (hints/explanations)
        const jsonUpdates: any = {};
        if (edit.hint !== undefined) {
          jsonUpdates.hint = edit.hint;
          fieldsChanged.push('Hint');
        }
        if (edit.explanation !== undefined) {
          jsonUpdates.explanation = edit.explanation;
          fieldsChanged.push('Explanation');
        }

        // Make API calls
        if (Object.keys(dbUpdates).length > 0) {
          console.log('💾 DB Updates:', dbUpdates);
          const dbResponse = await fetch('/api/admin/update-question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              questionId,
              updates: dbUpdates
            })
          });
          
          const dbResult = await dbResponse.json();
          if (dbResponse.ok) {
            console.log('✅ DB updated successfully:', dbResult);
            dbUpdated = true;
          } else {
            console.error('❌ DB update failed:', dbResult);
            throw new Error(`DB update failed: ${dbResult.error}`);
          }
        } else {
          console.log('⏭️ No DB updates needed');
        }

        if (Object.keys(jsonUpdates).length > 0) {
          console.log('📄 JSON Updates:', jsonUpdates);
          const jsonResponse = await fetch('/api/admin/update-hints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sectionKey: question.section_key,
              questionId: edit.question_id,
              updates: jsonUpdates
            })
          });
          
          const jsonResult = await jsonResponse.json();
          if (jsonResponse.ok) {
            console.log('✅ JSON updated successfully:', jsonResult);
            jsonUpdated = true;
          } else {
            console.error('❌ JSON update failed:', jsonResult);
            throw new Error(`JSON update failed: ${jsonResult.error}`);
          }
        } else {
          console.log('⏭️ No JSON updates needed');
        }

        // Add to results
        results.push({
          questionId: edit.question_id,
          questionText: question.question_text.substring(0, 60) + '...',
          dbUpdated,
          jsonUpdated,
          fieldsChanged
        });
      }

      console.log('\n🎉 All changes saved successfully!');
      setSaveResults(results);
      setShowSuccessModal(true);
      setEdits({});
    } catch (error) {
      console.error('💥 Error saving:', error);
      alert('❌ Error saving changes. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[8px] flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white rounded-[16px] shadow-[0_12px_48px_rgba(0,0,0,0.3)] w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-[slideUp_0.4s_ease-out]">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#f0f8ff] to-white px-8 py-6 border-b border-[#e0e0e0]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[28px] font-bold text-[#1a1a1a] tracking-tight">
                {quiz.title} - Preview & Edit
              </h2>
              <p className="text-[14px] text-[#666] font-medium mt-2">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#ccc] hover:text-[#666] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Question Text */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 mb-2">QUESTION TEXT</label>
            <textarea
              value={displayQuestion.question_text || ''}
              onChange={(e) => updateEdit('question_text', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
              rows={3}
            />
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 mb-2">IMAGE URL (optional)</label>
            <input
              type="text"
              value={displayQuestion.image_url || ''}
              onChange={(e) => updateEdit('image_url', e.target.value || null)}
              placeholder="https://..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {displayQuestion.image_url && (
              <img 
                src={displayQuestion.image_url} 
                alt="Question" 
                className="mt-3 max-h-64 rounded-lg border border-gray-200"
              />
            )}
          </div>

          {/* Answers */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 mb-2">ANSWER CHOICES</label>
            <div className="space-y-3">
              {Object.entries(displayQuestion.answers as Record<string, string>).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={displayQuestion.correct_answer === key}
                    onChange={() => updateEdit('correct_answer', key)}
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="font-bold text-gray-700 w-8">{key}:</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateAnswer(key, e.target.value)}
                    className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      displayQuestion.correct_answer === key 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Click the radio button to set the correct answer</p>
          </div>

          {/* Hint */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 mb-2">HINT</label>
            <textarea
              value={displayQuestion.hint || ''}
              onChange={(e) => updateEdit('hint', e.target.value)}
              className="w-full p-3 border border-orange-300 bg-orange-50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows={2}
              placeholder="Short, memorable hint..."
            />
          </div>

          {/* Explanation */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 mb-2">EXPLANATION (Markdown supported)</label>
            <textarea
              value={displayQuestion.explanation || ''}
              onChange={(e) => updateEdit('explanation', e.target.value)}
              className="w-full p-3 border border-blue-300 bg-blue-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              rows={6}
              placeholder="**Bold text**\n\n💡 **Remember it:** Use markdown formatting!"
            />
            {displayQuestion.explanation && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 mb-2">PREVIEW:</p>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{displayQuestion.explanation}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-colors font-medium"
              >
                ← Previous
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-colors font-medium"
              >
                Next →
              </button>
            </div>

            {hasEdits && (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-bold shadow-lg animate-pulse"
              >
                💾 Save All Changes ({Object.keys(edits).length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">⚠️ Confirm Changes</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to save <strong>{Object.keys(edits).length}</strong> question(s) with changes?
              This will update both the database and JSON files.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-bold disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Yes, Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal - TeslaMR Design System */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[8px] flex items-center justify-center z-[60] animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white rounded-[16px] shadow-[0_12px_48px_rgba(0,0,0,0.3)] max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col animate-[slideUp_0.4s_ease-out]">
            {/* Header */}
            <div className="bg-gradient-to-b from-[#d5f4e6] to-[#b8e5d2] px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-5xl animate-[celebrate_0.6s_ease]">🎉</span>
                <div>
                  <h3 className="text-[28px] font-bold text-gray-900 leading-tight tracking-tight">
                    Changes Saved Successfully!
                  </h3>
                  <p className="text-[14px] text-gray-700 font-medium mt-1">
                    All updates have been applied to the database and JSON files
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto flex-1">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-[#f0f8ff] to-white border border-[#e0e0e0] rounded-[12px] p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <div className="text-[32px] font-bold text-[#0A84FF] tracking-tight">{saveResults.length}</div>
                  <div className="text-[13px] text-gray-700 font-semibold mt-2 uppercase tracking-wide">Questions Updated</div>
                </div>
                <div className="bg-gradient-to-br from-[#f0f8ff] to-white border border-[#e0e0e0] rounded-[12px] p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <div className="text-[32px] font-bold text-[#5856D6] tracking-tight">
                    {saveResults.filter(r => r.dbUpdated).length}
                  </div>
                  <div className="text-[13px] text-gray-700 font-semibold mt-2 uppercase tracking-wide">Database Updates</div>
                </div>
                <div className="bg-gradient-to-br from-[#f0f8ff] to-white border border-[#e0e0e0] rounded-[12px] p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <div className="text-[32px] font-bold text-[#FF9500] tracking-tight">
                    {saveResults.filter(r => r.jsonUpdated).length}
                  </div>
                  <div className="text-[13px] text-gray-700 font-semibold mt-2 uppercase tracking-wide">JSON File Updates</div>
                </div>
              </div>

              {/* Details Section */}
              <h4 className="text-[14px] font-semibold text-gray-600 uppercase tracking-wide mb-4">📋 Detailed Changes</h4>
              <div className="space-y-3">
                {saveResults.map((result, idx) => (
                  <div 
                    key={idx} 
                    className="border border-[#e0e0e0] rounded-[12px] p-5 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-[#1a1a1a] text-[15px] mb-2">
                          Question {idx + 1}: <span className="text-gray-600 font-medium">{result.questionText}</span>
                        </p>
                        <code className="text-[11px] bg-[#f0f0f0] text-gray-700 px-2 py-1 rounded-[4px] font-semibold uppercase tracking-wide">
                          ID: {result.questionId}
                        </code>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4 text-[14px]">
                      <div className={`flex items-center gap-2 ${result.dbUpdated ? 'text-[#5856D6]' : 'text-gray-400'}`}>
                        <span className="text-[16px]">{result.dbUpdated ? '✓' : '○'}</span>
                        <span className="font-semibold">Database</span>
                      </div>
                      <div className={`flex items-center gap-2 ${result.jsonUpdated ? 'text-[#FF9500]' : 'text-gray-400'}`}>
                        <span className="text-[16px]">{result.jsonUpdated ? '✓' : '○'}</span>
                        <span className="font-semibold">JSON File</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#f0f0f0]">
                      <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-2">Fields Changed:</p>
                      <div className="flex flex-wrap gap-2">
                        {result.fieldsChanged.map((field, i) => (
                          <span 
                            key={i} 
                            className="text-[11px] bg-[#f0f8ff] text-[#0A84FF] px-3 py-1 rounded-[4px] font-semibold uppercase tracking-wide border border-[#e0f0ff]"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gradient-to-b from-white to-[#fafbfc] border-t border-[#e0e0e0]">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onClose();
                }}
                className="w-full px-12 py-4 bg-gradient-to-br from-[#34C759] to-[#28a745] text-white rounded-[12px] text-[18px] font-bold transition-all duration-300 hover:shadow-[0_6px_20px_rgba(88,214,141,0.4)] hover:-translate-y-[3px] hover:scale-[1.02] active:translate-y-0 active:scale-[0.98]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

