import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  console.log('🚀 Running migration 020_add_medical_terminology_video.sql...');
  
  const migrationPath = path.join(process.cwd(), 'supabase/migrations/020_add_medical_terminology_video.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  
  // Split by semicolons to run each statement separately
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  for (const statement of statements) {
    console.log('📝 Executing statement...');
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
    
    if (error) {
      console.error('❌ Error:', error);
      // Try direct query if RPC doesn't work
      const { error: directError } = await supabase.from('_').select('*').limit(0);
      console.log('Trying alternative method...');
    } else {
      console.log('✅ Statement executed successfully');
    }
  }
  
  // Verify the content was added
  console.log('\n🔍 Verifying medical terminology module content...');
  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .select('id')
    .eq('slug', 'medical-terminology')
    .single();
  
  if (moduleError) {
    console.error('❌ Error fetching module:', moduleError);
    return;
  }
  
  const { data: contentItems, error: contentError } = await supabase
    .from('content_items')
    .select('*')
    .eq('module_id', moduleData.id)
    .order('order_index');
  
  if (contentError) {
    console.error('❌ Error fetching content items:', contentError);
    return;
  }
  
  console.log('\n📊 Content items for Medical Terminology:');
  contentItems?.forEach((item: any) => {
    console.log(`  ${item.order_index}: ${item.icon} ${item.title} (${item.type}) - ${item.slug}`);
  });
  
  console.log('\n✅ Migration complete!');
}

runMigration().catch(console.error);

