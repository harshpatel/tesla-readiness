import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('📝 Progress API called');
  try {
    const body = await request.json();
    console.log('📦 Raw body:', body);
    
    const {
      questionId,
      sectionKey,
      isCorrect,
      isFirstAttempt,
      easinessFactor = 2.5, // Default value
      repetitions = 0, // Default value
      intervalDays = 0, // Default value
    } = body;
    
    console.log('📊 Progress data:', { 
      questionId, 
      sectionKey, 
      isCorrect, 
      isFirstAttempt,
      easinessFactor,
      repetitions,
      intervalDays
    });

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

    // Get current user - use getUser() for security
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('❌ No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    console.log('✅ User authenticated:', userId);

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

    // Try to get the content_item_id from the question (optional - may not exist for all quizzes)
    const { data: question } = await supabase
      .from('quiz_questions')
      .select('content_item_id, question_id')
      .eq('question_id', questionId)
      .single();

    // Don't fail if question not found in DB - questions come from JSON files
    if (question) {
      console.log('📌 Question content_item_id:', question.content_item_id);
    } else {
      console.log('ℹ️ Question not in DB (using JSON-only mode):', questionId);
    }

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
        console.error('❌ Error updating progress:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      console.log('✅ Progress updated successfully');
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
        console.error('❌ Error inserting progress:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      console.log('✅ Progress inserted successfully');
    }

    // Also update the new user_content_progress table if question exists in DB
    // This will trigger the cascading updates to module and section progress
    if (question?.content_item_id) {
      console.log('📝 Updating user_content_progress for content_item_id:', question.content_item_id);
      
      // Check if content progress exists
      const { data: existingContentProgress } = await supabase
        .from('user_content_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('content_item_id', question.content_item_id)
        .single();

      const isMastered = isCorrect && isFirstAttempt;
      const totalAttempts = existing 
        ? existing.correct_attempts + existing.incorrect_attempts + 1
        : 1;

      if (existingContentProgress) {
        // Update existing content progress
        const { error: contentError } = await supabase
          .from('user_content_progress')
          .update({
            completed: isMastered || existingContentProgress.completed,
            attempts: totalAttempts,
            last_accessed_at: new Date().toISOString(),
            completed_at: isMastered && !existingContentProgress.completed ? new Date().toISOString() : existingContentProgress.completed_at,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingContentProgress.id);

        if (contentError) {
          console.error('❌ Error updating content progress:', contentError);
        } else {
          console.log('✅ Content progress updated - triggers will update module & section progress');
        }
      } else {
        // Insert new content progress
        const { error: contentError } = await supabase
          .from('user_content_progress')
          .insert({
            user_id: userId,
            content_item_id: question.content_item_id,
            completed: isMastered,
            attempts: 1,
            last_accessed_at: new Date().toISOString(),
            completed_at: isMastered ? new Date().toISOString() : null,
          });

        if (contentError) {
          console.error('❌ Error inserting content progress:', contentError);
        } else {
          console.log('✅ Content progress inserted - triggers will update module & section progress');
        }
      }
    } else {
      console.log('ℹ️ Skipping content progress update (question not in DB)');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in progress API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

