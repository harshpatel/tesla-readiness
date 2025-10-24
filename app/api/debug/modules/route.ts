import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    // Fetch Phase 1 modules
    const { data: phase1, error: phase1Error } = await supabase
      .from('sections')
      .select('id')
      .eq('slug', 'phase1')
      .single();

    if (phase1Error || !phase1) {
      return NextResponse.json({ error: 'Phase 1 not found', details: phase1Error });
    }

    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .eq('section_id', phase1.id)
      .order('order_index');

    if (modulesError) {
      return NextResponse.json({ error: 'Failed to fetch modules', details: modulesError });
    }

    return NextResponse.json({ 
      phase1_id: phase1.id,
      modules: modules || [],
      count: modules?.length || 0
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}

