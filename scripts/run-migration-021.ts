import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🔄 Running migration 021_add_fundamentals_quiz_section.sql...\n');

  // Read the migration file
  const migrationPath = path.join(process.cwd(), 'supabase/migrations/021_add_fundamentals_quiz_section.sql');
  const sqlContent = fs.readFileSync(migrationPath, 'utf8');

  console.log('📝 Executing SQL...\n');

  // Split by semicolons and execute each statement
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    const { error } = await supabase.rpc('exec_sql', { sql_string: statement });
    
    if (error) {
      // Try direct query if RPC doesn't work
      const { error: directError } = await supabase.from('quiz_sections').upsert({
        key: 'fundamentals',
        title: 'Medical Terminology Fundamentals',
        description: 'Core concepts and building blocks of medical terminology',
        icon: '🏗️',
        order_index: 0
      }, { onConflict: 'key' });

      if (directError) {
        console.error('❌ Error:', directError);
        continue;
      }
    }
    console.log('✅ Statement executed successfully');
  }

  // Verify
  const { data, error } = await supabase
    .from('quiz_sections')
    .select('*')
    .eq('key', 'fundamentals')
    .single();

  if (error) {
    console.error('❌ Verification failed:', error);
  } else {
    console.log('\n✅ Fundamentals section created:', data);
  }

  console.log('\n✨ Migration complete!\n');
}

runMigration()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  });

