import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Test 1: Check if profiles table exists
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    // Test 2: Check if quizzes table exists
    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('*')
      .limit(1);

    // Test 3: Check if questions table exists
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .limit(1);

    // Test 4: Check if student_progress table exists
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .select('*')
      .limit(1);

    // Test 5: Check if review_history table exists
    const { data: history, error: historyError } = await supabase
      .from('review_history')
      .select('*')
      .limit(1);

    const tables = {
      profiles: profilesError ? `Error: ${profilesError.message}` : '✅ Table exists',
      quizzes: quizzesError ? `Error: ${quizzesError.message}` : '✅ Table exists',
      questions: questionsError ? `Error: ${questionsError.message}` : '✅ Table exists',
      student_progress: progressError ? `Error: ${progressError.message}` : '✅ Table exists',
      review_history: historyError ? `Error: ${historyError.message}` : '✅ Table exists',
    };

    return NextResponse.json({
      success: true,
      message: 'Database migration verification',
      tables,
      counts: {
        profiles: profiles?.length || 0,
        quizzes: quizzes?.length || 0,
        questions: questions?.length || 0,
        progress: progress?.length || 0,
        history: history?.length || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}



