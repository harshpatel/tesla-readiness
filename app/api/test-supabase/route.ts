import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Test the connection by querying the Supabase database
    // This will attempt to fetch from a table (you may need to adjust based on your schema)
    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1)

    if (error) {
      // If the table doesn't exist, that's okay - it means we connected successfully
      if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
        return NextResponse.json({
          success: true,
          message: 'Supabase connection successful! (No tables found, but connection works)',
          connectionTest: 'passed',
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        })
      }
      
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      data: data,
      connectionTest: 'passed',
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Supabase connection failed',
        error: error.message,
        connectionTest: 'failed',
      },
      { status: 500 }
    )
  }
}

