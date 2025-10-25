import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Check if currently impersonating
    const impersonatingUserId = cookieStore.get('impersonating_user_id');
    
    if (!impersonatingUserId) {
      return NextResponse.json({ error: 'Not currently impersonating' }, { status: 400 });
    }

    // Clear impersonation cookies
    cookieStore.delete('impersonating_user_id');
    cookieStore.delete('original_admin_id');

    return NextResponse.json({ 
      success: true,
      message: 'Impersonation ended'
    });
  } catch (error) {
    console.error('Exit impersonation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

