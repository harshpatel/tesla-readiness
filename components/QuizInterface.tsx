'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { QuizQuestion } from '@/lib/types/quiz';
import { calculateNextReview } from '@/lib/algorithms/spacedRepetition';

interface QuizInterfaceProps {
  sectionKey: string;
  sectionTitle: string;
  sectionIcon: string;
  questions: QuizQuestion[];
  userId: string;
  userEmail?: string;
}

export default function QuizInterface({
  sectionKey,
  sectionTitle,
  sectionIcon,
  questions,
  userId,
  userEmail,
}: QuizInterfaceProps) {
  const router = useRouter();
  
  // Quiz state
  const [questionQueue, setQuestionQueue] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [masteredQuestions, setMasteredQuestions] = useState<Set<string>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSecondAttempt, setIsSecondAttempt] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Stats
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize question queue
  useEffect(() => {
    // Shuffle questions for randomness
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestionQueue(shuffled);
    setIsLoading(false);
  }, [questions]);

  const currentQuestion = questionQueue[currentQuestionIndex];
  const progress = masteredQuestions.size;
  const remaining = questionQueue.length;
  const progressPercent = questions.length > 0 ? (progress / questions.length) * 100 : 0;

  // Handle answer selection
  const handleAnswerSelect = useCallback(async (answer: string) => {
    if (isAnswered && isSecondAttempt) return; // Already answered twice
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correct_answer;
    setIsCorrect(correct);

    if (!isSecondAttempt) {
      // First attempt
      if (correct) {
        setIsAnswered(true);
        setCorrectCount(prev => prev + 1);
        setMasteredQuestions(prev => new Set(prev).add(currentQuestion.question_id));
        setShowFeedback(true);
        
        // Save progress to Supabase
        await saveProgress(currentQuestion, true, true);
      } else {
        // Wrong on first attempt - show hint and allow retry
        setIsSecondAttempt(true);
        setShowFeedback(true);
      }
    } else {
      // Second attempt - always counts as incorrect
      setIsAnswered(true);
      setIncorrectCount(prev => prev + 1);
      setShowFeedback(true);
      
      // Save progress as incorrect
      await saveProgress(currentQuestion, false, false);
    }
  }, [currentQuestion, isAnswered, isSecondAttempt, currentQuestionIndex]);

  // Save progress to Supabase
  const saveProgress = async (question: QuizQuestion, isCorrect: boolean, isFirstAttempt: boolean) => {
    setIsSaving(true);
    try {
      const quality = isCorrect && isFirstAttempt ? 5 : isCorrect ? 3 : 0;
      
      // Calculate next review using SM-2
      const nextReview = calculateNextReview(quality, {
        repetitions: 0,
        easeFactor: 2.5,
        intervalDays: 0,
      });
      
      console.log('📊 Calculated next review:', nextReview);

      const response = await fetch('/api/quiz/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.question_id,
          sectionKey: question.section_key,
          isCorrect,
          isFirstAttempt,
          easinessFactor: nextReview.easeFactor,
          repetitions: nextReview.repetitions,
          intervalDays: nextReview.intervalDays,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Failed to save progress:', {
          status: response.status,
          statusText: response.statusText,
          responseBody: responseText,
          questionId: question.question_id,
        });
        
        // Try to parse as JSON
        try {
          const errorData = JSON.parse(responseText);
          console.error('Parsed error:', errorData);
        } catch (e) {
          console.error('Response was not valid JSON');
        }
      } else {
        console.log('✅ Progress saved successfully for question:', question.question_id);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle next question
  const handleNext = () => {
    if (isCorrect && !isSecondAttempt) {
      // Correct on first try - remove from queue (mastered)
      setQuestionQueue(prev => prev.filter((_, idx) => idx !== currentQuestionIndex));
    } else if (isSecondAttempt) {
      // Second attempt (correct or incorrect) - move to end of queue
      setQuestionQueue(prev => {
        const newQueue = [...prev];
        const question = newQueue.splice(currentQuestionIndex, 1)[0];
        newQueue.push(question);
        return newQueue;
      });
      setCurrentQuestionIndex(0);
    }
    
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsSecondAttempt(false);
  };

  // Check if quiz is complete
  useEffect(() => {
    if (questionQueue.length === 0 && !isLoading) {
      // Quiz complete! Return to dashboard with updated progress
      router.push('/dashboard');
    }
  }, [questionQueue.length, isLoading, router]);

  // Keyboard shortcuts for answer selection
  useEffect(() => {
    if (showFeedback) return; // Don't listen when feedback is showing

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const availableAnswers = Object.keys(currentQuestion.answers);
      
      if (availableAnswers.includes(key)) {
        handleAnswerSelect(key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, showFeedback, handleAnswerSelect]);

  // Keyboard shortcuts for "Got it!" button (Enter or Space)
  useEffect(() => {
    if (!showFeedback) return; // Only listen when feedback is showing

    const handleFeedbackKeyPress = (e: KeyboardEvent) => {
      // Handle "Try Again" button (first attempt incorrect)
      if (!isCorrect && !isSecondAttempt && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        setShowFeedback(false);
        return;
      }

      // Handle "Got it!" button (correct or second attempt)
      if ((isCorrect || isSecondAttempt) && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        if (!isSaving) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleFeedbackKeyPress);
    return () => window.removeEventListener('keydown', handleFeedbackKeyPress);
  }, [showFeedback, isCorrect, isSecondAttempt, isSaving, handleNext]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <p className="text-gray-600">Redirecting to results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={`${sectionIcon} ${sectionTitle}`} showAuth showBackButton userEmail={userEmail} />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Section */}
          <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-600 font-semibold mb-2">
              <span>{progress} mastered</span>
              <span>{remaining} remaining</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0A84FF] to-[#0077ED] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-3 text-xs">
              <div className="flex gap-4">
                <span className="text-gray-600">
                  Correct: <strong className="text-[#34C759]">{correctCount}</strong>
                </span>
                <span className="text-gray-600">
                  Incorrect: <strong className="text-[#FF3B30]">{incorrectCount}</strong>
                </span>
              </div>
              <span className="text-gray-600">
                Score: <strong className="text-[#1a1a1a]">
                  {correctCount + incorrectCount > 0 
                    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) 
                    : 0}%
                </strong>
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="quiz-container p-6 md:p-8 mb-6 relative">
            {/* Question Type Badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-50 text-[#0A84FF] text-xs font-semibold uppercase tracking-wide rounded">
                {currentQuestion.question_type === 'multiplechoice' ? 'Multiple Choice' : 'True/False'}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-6 leading-tight">
              {currentQuestion.question_text}
            </h2>

            {/* Answer Options OR Feedback */}
            {!showFeedback ? (
              <div className="space-y-3 mb-6">
                {Object.entries(currentQuestion.answers).map(([letter, text]) => {
                  const isSelected = selectedAnswer === letter;

                  let buttonClass = 'w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ';
                  
                  if (isSelected) {
                    buttonClass += 'bg-gradient-to-r from-blue-50 to-blue-100 border-[#0A84FF]';
                  } else {
                    buttonClass += 'bg-white border-gray-300 hover:border-[#0A84FF] hover:bg-blue-50';
                  }

                  return (
                    <button
                      key={letter}
                      onClick={() => handleAnswerSelect(letter)}
                      className={buttonClass}
                    >
                      {/* Keyboard Key Style */}
                      <div className={`
                        px-3 py-2 rounded-lg font-bold text-sm flex-shrink-0 shadow-sm
                        ${isSelected 
                          ? 'bg-[#0A84FF] text-white border-2 border-[#0077ED] shadow-md' 
                          : 'bg-gradient-to-b from-gray-50 to-gray-100 text-gray-700 border border-gray-300 shadow-[0_2px_0_0_rgba(0,0,0,0.1)]'}
                      `}>
                        {letter}
                      </div>
                      <span className="flex-1 font-medium text-[#1a1a1a]">{text}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mb-6 animate-[fadeIn_0.3s_ease-out]">
                  <div 
                    className={`rounded-2xl p-6 ${
                      isCorrect && !isSecondAttempt
                        ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-[#34C759]'
                        : 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-[#FF9500]'
                    }`}
                  >
                    {isCorrect && !isSecondAttempt ? (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-4xl">🎉</span>
                          <h3 className="text-2xl font-bold text-[#34C759]">Correct!</h3>
                        </div>
                        {currentQuestion.explanation && (
                          <div 
                            className="text-base text-gray-800 leading-relaxed mb-6"
                            dangerouslySetInnerHTML={{
                              __html: currentQuestion.explanation
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n/g, '<br/>')
                            }}
                          />
                        )}
                        {!currentQuestion.explanation && (
                          <p className="text-base text-gray-800 mb-6">Great job! Moving to next question...</p>
                        )}
                        <button
                          onClick={handleNext}
                          disabled={isSaving}
                          className="w-full py-3 px-6 bg-gradient-to-r from-[#34C759] to-[#30B350] text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                        >
                          {isSaving ? 'Saving...' : 'Got it! →'}
                        </button>
                      </>
                    ) : !isSecondAttempt ? (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-4xl">💡</span>
                          <h3 className="text-2xl font-bold text-[#FF9500]">Not quite - try again!</h3>
                        </div>
                        {currentQuestion.hint ? (
                          <div className="text-base text-gray-800 bg-white p-4 rounded-xl border-2 border-orange-300 mb-6">
                            <strong className="text-[#FF9500]">💡 Hint:</strong> {currentQuestion.hint}
                          </div>
                        ) : (
                          <p className="text-base text-gray-800 mb-6">
                            Think about the meaning of the word parts. Take another look at the options.
                          </p>
                        )}
                        <button
                          onClick={() => setShowFeedback(false)}
                          className="w-full py-3 px-6 bg-gradient-to-r from-[#FF9500] to-[#FF8500] text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                        >
                          Try Again
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-4xl">📚</span>
                          <h3 className="text-2xl font-bold text-[#FF9500]">
                            {isCorrect ? 'Correct on 2nd attempt!' : 'Incorrect'}
                          </h3>
                        </div>
                        {currentQuestion.explanation && (
                          <div 
                            className="text-base text-gray-800 leading-relaxed mb-4"
                            dangerouslySetInnerHTML={{
                              __html: currentQuestion.explanation
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n/g, '<br/>')
                            }}
                          />
                        )}
                        <p className="text-sm text-gray-600 mb-6 italic">This question will appear again later for review.</p>
                        <button
                          onClick={handleNext}
                          disabled={isSaving}
                          className="w-full py-3 px-6 bg-gradient-to-r from-[#FF9500] to-[#FF8500] text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all"
                        >
                          {isSaving ? 'Saving...' : 'Got it! →'}
                        </button>
                      </>
                    )}
                  </div>
              </div>
            )}
          </div>

          {/* Navigation Hint */}
          <div className="text-center text-sm text-gray-500">
            <p>💡 Answer correctly on the first try to master the question!</p>
          </div>
        </div>
      </main>
      
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <span className="text-sm text-gray-600">Saving progress...</span>
        </div>
      )}
    </div>
  );
}

