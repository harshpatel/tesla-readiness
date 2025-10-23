/**
 * SM-2 Spaced Repetition Algorithm
 * 
 * Quality ratings (0-5):
 * 5 - Perfect response
 * 4 - Correct response with hesitation
 * 3 - Correct response with difficulty
 * 2 - Incorrect response but remembered
 * 1 - Incorrect response, seemed familiar
 * 0 - Complete blackout
 */

export interface SpacedRepetitionResult {
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewDate: Date;
}

export interface ProgressState {
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
}

/**
 * Calculate the next review date and update spaced repetition parameters
 * 
 * @param quality - Quality of recall (0-5)
 * @param previousState - Previous spaced repetition state
 * @returns Updated spaced repetition parameters
 */
export function calculateNextReview(
  quality: number,
  previousState: ProgressState = {
    repetitions: 0,
    easeFactor: 2.5,
    intervalDays: 0,
  }
): SpacedRepetitionResult {
  let { repetitions, easeFactor, intervalDays } = previousState;

  // Quality must be between 0 and 5
  if (quality < 0 || quality > 5) {
    throw new Error('Quality must be between 0 and 5');
  }

  // Update ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Ease factor should not be less than 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // If quality < 3, reset repetitions and interval
  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    // Increment repetitions
    repetitions += 1;

    // Calculate new interval
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
  nextReviewDate.setHours(0, 0, 0, 0); // Set to start of day

  return {
    repetitions,
    easeFactor: Math.round(easeFactor * 100) / 100, // Round to 2 decimal places
    intervalDays,
    nextReviewDate,
  };
}

/**
 * Determine if a question is due for review
 * 
 * @param nextReviewDate - The scheduled next review date
 * @returns true if the question should be reviewed
 */
export function isDueForReview(nextReviewDate: Date | string): boolean {
  const now = new Date();
  const reviewDate = typeof nextReviewDate === 'string' ? new Date(nextReviewDate) : nextReviewDate;
  return now >= reviewDate;
}

/**
 * Get quality rating from a boolean correct/incorrect answer
 * You can customize this based on your UI (e.g., add timing, confidence)
 * 
 * @param isCorrect - Whether the answer was correct
 * @param hesitation - Optional hesitation level (0-1)
 * @returns Quality rating (0-5)
 */
export function getQualityFromAnswer(
  isCorrect: boolean,
  hesitation: number = 0
): number {
  if (!isCorrect) {
    // Incorrect: quality 0-2
    return hesitation > 0.5 ? 1 : 0;
  }

  // Correct: quality 3-5 based on hesitation
  if (hesitation < 0.2) return 5; // Perfect, quick response
  if (hesitation < 0.5) return 4; // Correct with slight hesitation
  return 3; // Correct but difficult
}

/**
 * Calculate overall quiz mastery percentage
 * 
 * @param progress - Array of student progress records
 * @returns Mastery percentage (0-100)
 */
export function calculateMastery(progress: ProgressState[]): number {
  if (progress.length === 0) return 0;

  const totalScore = progress.reduce((sum, p) => {
    // Higher repetitions and ease factor = better mastery
    const masteryScore = Math.min(100, (p.repetitions * 20) + ((p.easeFactor - 1.3) * 50));
    return sum + masteryScore;
  }, 0);

  return Math.round(totalScore / progress.length);
}



