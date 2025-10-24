require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePrefixesQuiz() {
  console.log('📖 Reading updated quiz data...');
  const questions = JSON.parse(fs.readFileSync('first-quiz-questions.json', 'utf8'));
  
  console.log(`✅ Loaded ${questions.length} questions\n`);
  
  let updated = 0;
  let failed = 0;
  
  for (const question of questions) {
    console.log(`Updating: ${question.question_id}`);
    
    const { error } = await supabase
      .from('quiz_questions')
      .update({
        hint: question.hint,
        explanation: question.explanation,
        updated_at: new Date().toISOString()
      })
      .eq('id', question.id);
    
    if (error) {
      console.error(`  ❌ Failed:`, error.message);
      failed++;
    } else {
      console.log(`  ✅ Updated`);
      updated++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Successfully updated: ${updated}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total: ${questions.length}`);
}

updatePrefixesQuiz()
  .then(() => {
    console.log('\n🎉 Prefixes quiz updated in database!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error:', error);
    process.exit(1);
  });

