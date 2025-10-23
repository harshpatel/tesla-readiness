/**
 * Fix Section Progress Calculation
 * 
 * Updates the database trigger to correctly count total questions in each section
 * (not just the questions the user has attempted).
 * 
 * Run with: npx tsx scripts/fix-section-progress.ts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixSectionProgress() {
  console.log('🔧 Fixing section progress calculation...\n');

  // Read the SQL file
  const sqlPath = path.join(process.cwd(), 'scripts/fix-section-progress.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  console.log('📝 Running SQL script...');
  
  const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();

  if (error) {
    // If exec_sql doesn't exist, we need to run the SQL manually
    console.log('⚠️  exec_sql function not available, executing statements individually...\n');
    
    // Execute each statement
    const statements = [
      // Drop old triggers
      `DROP TRIGGER IF EXISTS update_section_progress_trigger ON public.user_quiz_progress`,
      `DROP FUNCTION IF EXISTS update_section_progress_summary()`,
      `DROP TRIGGER IF EXISTS trg_update_user_section_progress ON public.user_quiz_progress`,
      `DROP FUNCTION IF EXISTS public.update_user_section_progress()`,
    ];

    for (const stmt of statements) {
      const { error: stmtError } = await supabase.rpc('exec_sql', { sql_query: stmt });
      if (stmtError) {
        console.log(`   Running: ${stmt.substring(0, 50)}...`);
      }
    }

    console.log('\n⚠️  Please run the SQL file manually in Supabase SQL Editor:');
    console.log('   1. Go to your Supabase Dashboard');
    console.log('   2. Click "SQL Editor" in the left sidebar');
    console.log('   3. Copy the contents of scripts/fix-section-progress.sql');
    console.log('   4. Paste and click "Run"');
    console.log('\nOr use the Supabase CLI:');
    console.log('   npx supabase db execute -f scripts/fix-section-progress.sql --db-url "your-db-url"');
    process.exit(1);
  }

  console.log('✅ SQL script executed successfully!\n');
  
  // Verify the fix by checking progress records
  console.log('🔍 Verifying section progress...');
  const { data: progress, error: progressError } = await supabase
    .from('user_section_progress')
    .select('section_key, total_questions, mastered_questions');

  if (progressError) {
    console.error('❌ Error fetching progress:', progressError);
    process.exit(1);
  }

  console.log('\n📊 Current Progress:');
  progress?.forEach((p) => {
    console.log(`   ${p.section_key}: ${p.mastered_questions}/${p.total_questions}`);
  });

  console.log('\n🎉 Section progress fix completed!');
}

fixSectionProgress().catch((error) => {
  console.error('❌ Fix failed:', error);
  process.exit(1);
});

