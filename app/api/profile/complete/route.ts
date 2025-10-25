import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkMutationAllowed } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Check if mutations are allowed (block if impersonating)
  const mutationCheck = await checkMutationAllowed();
  if (mutationCheck.blocked) {
    return NextResponse.json({ error: mutationCheck.error }, { status: 403 });
  }
  
  try {
    console.log('Profile completion API called');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { userId, firstName, lastName, phone, dateOfBirth } = body;

    if (!userId || !firstName || !lastName || !phone || !dateOfBirth) {
      console.error('Missing required fields:', { userId, firstName, lastName, phone, dateOfBirth });
      return NextResponse.json(
        { error: 'All fields are required' },
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
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (e) {
              console.error('Error setting cookies:', e);
            }
          },
        },
        global: {
          fetch: fetch,
        },
      }
    );

    console.log('Attempting to update profile for user:', userId);
    
    // Update the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        phone: phone,
        date_of_birth: dateOfBirth,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile', details: error.message },
        { status: 500 }
      );
    }

    console.log('Profile updated successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in profile completion API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

