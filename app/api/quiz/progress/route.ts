import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      questionId,
      sectionKey,
      isCorrect,
      isFirstAttempt,
      easinessFactor,
      repetitions,
      intervalDays,
    } = body;

    // Create Supabase client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Get current user
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

    // Check if progress exists
    const { data: existing } = await supabase
      .from('user_quiz_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .single();

    if (existing) {
      // Update existing progress
      const { error } = await supabase
        .from('user_quiz_progress')
        .update({
          easiness_factor: easinessFactor,
          repetitions,
          interval_days: intervalDays,
          next_review_date: nextReviewDate.toISOString(),
          correct_attempts: existing.correct_attempts + (isCorrect ? 1 : 0),
          incorrect_attempts: existing.incorrect_attempts + (isCorrect ? 0 : 1),
          mastered: isCorrect && isFirstAttempt,
          last_attempt_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      // Insert new progress
      const { error } = await supabase.from('user_quiz_progress').insert({
        user_id: userId,
        question_id: questionId,
        section_key: sectionKey,
        easiness_factor: easinessFactor,
        repetitions,
        interval_days: intervalDays,
        next_review_date: nextReviewDate.toISOString(),
        correct_attempts: isCorrect ? 1 : 0,
        incorrect_attempts: isCorrect ? 0 : 1,
        mastered: isCorrect && isFirstAttempt,
        last_attempt_date: new Date().toISOString(),
      });

      if (error) {
        console.error('Error inserting progress:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in progress API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

