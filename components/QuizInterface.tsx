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
        
        // Remove from queue after small delay
        setTimeout(() => {
          setQuestionQueue(prev => prev.filter((_, idx) => idx !== currentQuestionIndex));
          setSelectedAnswer(null);
          setIsAnswered(false);
          setShowFeedback(false);
        }, 2000);
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
      
      // Move to end of queue for spaced repetition
      setTimeout(() => {
        setQuestionQueue(prev => {
          const newQueue = [...prev];
          const question = newQueue.splice(currentQuestionIndex, 1)[0];
          newQueue.push(question);
          return newQueue;
        });
        setSelectedAnswer(null);
        setIsAnswered(false);
        setIsSecondAttempt(false);
        setShowFeedback(false);
        setCurrentQuestionIndex(0);
      }, 3000);
    }
  }, [currentQuestion, isAnswered, isSecondAttempt, currentQuestionIndex]);

  // Save progress to Supabase
  const saveProgress = async (question: QuizQuestion, isCorrect: boolean, isFirstAttempt: boolean) => {
    setIsSaving(true);
    try {
      const quality = isCorrect && isFirstAttempt ? 5 : isCorrect ? 3 : 0;
      
      // Calculate next review using SM-2
      const nextReview = calculateNextReview({
        quality,
        previousEaseFactor: 2.5,
        previousRepetitions: 0,
        previousIntervalDays: 0,
      });

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
        console.error('Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle next question
  const handleNext = () => {
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
          <div className="quiz-container p-6 md:p-8 mb-6">
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

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {Object.entries(currentQuestion.answers).map(([letter, text]) => {
                const isSelected = selectedAnswer === letter;
                const isCorrectAnswer = letter === currentQuestion.correct_answer;
                const showCorrect = isAnswered && isCorrectAnswer;
                const showIncorrect = isAnswered && isSelected && !isCorrect;

                let buttonClass = 'w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ';
                
                if (showCorrect) {
                  buttonClass += 'bg-gradient-to-r from-green-50 to-green-100 border-[#34C759] shadow-lg';
                } else if (showIncorrect) {
                  buttonClass += 'bg-gradient-to-r from-red-50 to-red-100 border-[#FF3B30] shadow-lg';
                } else if (isSelected) {
                  buttonClass += 'bg-gradient-to-r from-blue-50 to-blue-100 border-[#0A84FF]';
                } else {
                  buttonClass += 'bg-white border-gray-300 hover:border-[#0A84FF] hover:bg-blue-50';
                }

                return (
                  <button
                    key={letter}
                    onClick={() => !isAnswered && handleAnswerSelect(letter)}
                    disabled={isAnswered && isSecondAttempt}
                    className={buttonClass}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                      ${showCorrect ? 'bg-[#34C759] text-white' : 
                        showIncorrect ? 'bg-[#FF3B30] text-white' :
                        isSelected ? 'bg-[#0A84FF] text-white' :
                        'bg-gray-200 text-gray-700'}
                    `}>
                      {letter}
                    </div>
                    <span className="flex-1 font-medium text-[#1a1a1a]">{text}</span>
                    {showCorrect && <span className="text-[#34C759] text-xl">✓</span>}
                    {showIncorrect && <span className="text-[#FF3B30] text-xl">✗</span>}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showFeedback && (
              <div className={`p-4 rounded-xl border-2 ${
                isCorrect && !isSecondAttempt
                  ? 'bg-green-50 border-[#34C759]'
                  : 'bg-orange-50 border-[#FF9500]'
              }`}>
                {isCorrect && !isSecondAttempt ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎉</span>
                      <h3 className="text-lg font-bold text-[#34C759]">Correct!</h3>
                    </div>
                    <p className="text-sm text-gray-700">Great job! Moving to next question...</p>
                  </>
                ) : !isSecondAttempt ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">💡</span>
                      <h3 className="text-lg font-bold text-[#FF9500]">Try Again!</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Hint:</strong> Think about the meaning of the word parts. Take another look at the options.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📚</span>
                      <h3 className="text-lg font-bold text-[#FF9500]">
                        {isCorrect ? 'Correct (2nd attempt)' : 'Incorrect'}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong>Answer:</strong> {currentQuestion.correct_answer}: {currentQuestion.answers[currentQuestion.correct_answer]}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">This question will appear again later for review.</p>
                  </>
                )}
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

