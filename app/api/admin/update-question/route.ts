import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  console.log('\n🔵 [API] /api/admin/update-question called');
  
  // Check if user is admin
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    console.error('❌ [API] Unauthorized access attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  console.log('✅ [API] Admin check passed');

  try {
    const { questionId, updates } = await request.json();
    console.log('📥 [API] Request payload:', { questionId, updates });

    if (!questionId || !updates) {
      console.error('❌ [API] Missing required fields');
      return NextResponse.json({ error: 'Missing questionId or updates' }, { status: 400 });
    }

    // Use direct service client to bypass RLS
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('🔄 [API] Attempting to update question in database...');
    console.log('🔍 [API] Looking for question with id:', questionId);
    
    // First, check if the question exists
    const { data: existingQuestion, error: checkError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('id', questionId)
      .maybeSingle();
    
    if (checkError) {
      console.error('❌ [API] Error checking if question exists:', checkError);
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }
    
    if (!existingQuestion) {
      console.error('❌ [API] Question not found with id:', questionId);
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    console.log('✅ [API] Found existing question:', existingQuestion.question_id);
    
    const updatePayload = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    console.log('📦 [API] Update payload:', updatePayload);
    
    // Update the question in the database (don't use .single() to avoid the error)
    const { data, error } = await supabase
      .from('quiz_questions')
      .update(updatePayload)
      .eq('id', questionId)
      .select();

    console.log('📊 [API] Update response - data:', data, 'error:', error);

    if (error) {
      console.error('❌ [API] Database update failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.error('❌ [API] Update returned 0 rows - This indicates an RLS policy is blocking the update');
      return NextResponse.json({ error: 'Update failed - no rows affected' }, { status: 500 });
    }

    console.log('✅ [API] Database updated successfully!');
    console.log('📤 [API] Updated data:', data[0]);

    return NextResponse.json({ success: true, data: data[0] });
  } catch (error: any) {
    console.error('💥 [API] Unexpected error in update-question route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

