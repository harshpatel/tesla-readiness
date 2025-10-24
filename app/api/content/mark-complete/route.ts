import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { userId, contentItemId, completed } = await request.json();

    console.log('📝 Mark complete API called with:', { userId, contentItemId, completed });

    if (!userId || !contentItemId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
        global: {
          fetch: fetch,
        },
      }
    );

    console.log('🔄 Attempting to upsert content progress...');

    // Upsert user content progress
    const { data, error } = await supabase
      .from('user_content_progress')
      .upsert(
        {
          user_id: userId,
          content_item_id: contentItemId,
          completed: completed,
          last_accessed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,content_item_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating content progress:', error);
      return NextResponse.json(
        { error: 'Failed to update progress', details: error },
        { status: 500 }
      );
    }

    console.log('✅ Content progress updated successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('❌ Error in mark-complete API:', {
      message: error.message,
      details: error.stack,
      hint: error.hint || '',
      code: error.code || ''
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

