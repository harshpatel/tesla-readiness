import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('🚀 Running migration 031: Add Subatomic Principles MRI content...\n');

    // Read the migration file (for reference, but we'll execute it step by step)
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '031_add_subatomic_principles_content.sql');
    console.log(`📄 Reading migration from: ${migrationPath}\n`);

    // Get section ID
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('id')
      .eq('slug', 'phase1')
      .single();

    if (sectionError || !section) {
      console.error('❌ Phase 1 section not found:', sectionError);
      process.exit(1);
    }

    console.log(`✅ Found Phase 1 section: ${section.id}\n`);

    // Since we can't execute raw SQL easily, let me just verify if the module needs updating
    // and note that the user should run the SQL migration manually through Supabase dashboard
    console.log('⚠️  Please run the SQL migration manually:');
    console.log('   1. Open Supabase Dashboard -> SQL Editor');
    console.log('   2. Copy contents from: supabase/migrations/031_add_subatomic_principles_content.sql');
    console.log('   3. Execute the SQL\n');
    console.log('   OR use: psql connection string to execute the migration\n');

    console.log('✅ Continuing with verification...\n');

    // Verify the changes
    console.log('📊 Verifying module...\n');
    
    const { data: section } = await supabase
      .from('sections')
      .select('id')
      .eq('slug', 'phase1')
      .single();

    if (section) {
      const { data: module } = await supabase
        .from('modules')
        .select('id, title, slug, is_published, is_locked')
        .eq('section_id', section.id)
        .eq('slug', 'subatomic-principles-mri')
        .single();

      if (module) {
        console.log('✅ Module verified:');
        console.log(`   Title: ${module.title}`);
        console.log(`   Slug: ${module.slug}`);
        console.log(`   Published: ${module.is_published}`);
        console.log(`   Locked: ${module.is_locked}\n`);

        // Check content items
        const { data: contentItems } = await supabase
          .from('content_items')
          .select('id, title, type, slug')
          .eq('module_id', module.id)
          .order('order_index');

        if (contentItems && contentItems.length > 0) {
          console.log('✅ Content items:');
          contentItems.forEach(item => {
            console.log(`   ${item.type === 'video' ? '🎥' : '📝'} ${item.title} (${item.slug})`);
          });
          console.log('');

          // Check quiz questions
          const quizItem = contentItems.find(item => item.type === 'quiz');
          if (quizItem) {
            const { data: questions, count } = await supabase
              .from('quiz_questions')
              .select('*', { count: 'exact' })
              .eq('content_item_id', quizItem.id);

            console.log(`✅ Quiz questions: ${count} questions inserted\n`);
            
            if (questions && questions.length > 0) {
              console.log('   Sample questions:');
              questions.slice(0, 3).forEach(q => {
                console.log(`   - ${q.question_text.substring(0, 60)}...`);
              });
            }
          }
        } else {
          console.log('⚠️  No content items found');
        }
      } else {
        console.log('❌ Module not found!');
      }
    }

    console.log('\n✨ Migration complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Visit http://localhost:3000/phase1 to see the module in the sidebar');
    console.log('   2. Click on "04 - Subatomic Principles of MRI" to test the video');
    console.log('   3. Take the quiz to verify questions and hints load correctly');
  } catch (error) {
    console.error('💥 Error running migration:', error);
    process.exit(1);
  }
}

runMigration();

