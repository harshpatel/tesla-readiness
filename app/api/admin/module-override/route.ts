import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { userId, moduleId, action } = await request.json();

    if (!userId || !moduleId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (action !== 'unlock' && action !== 'lock') {
      return NextResponse.json(
        { error: 'Invalid action. Must be "unlock" or "lock"' },
        { status: 400 }
      );
    }

    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'master_admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Use service role client for admin operations (bypasses RLS)
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

    if (action === 'unlock') {
      // Create or update override to unlock
      const { error } = await supabase
        .from('user_module_overrides')
        .upsert(
          {
            user_id: userId,
            module_id: moduleId,
            is_unlocked: true,
            unlocked_by: adminUser.id,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,module_id',
          }
        );

      if (error) {
        console.error('Error unlocking module:', error);
        return NextResponse.json(
          { error: 'Failed to unlock module' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Module unlocked successfully',
        action: 'unlock',
      });
    } else {
      // Lock: Delete the override
      const { error } = await supabase
        .from('user_module_overrides')
        .delete()
        .eq('user_id', userId)
        .eq('module_id', moduleId);

      if (error) {
        console.error('Error locking module:', error);
        return NextResponse.json(
          { error: 'Failed to lock module' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Module locked successfully (override removed)',
        action: 'lock',
      });
    }
  } catch (error) {
    console.error('Error in module override:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

