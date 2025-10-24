require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkQuestion() {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('question_id, hint, explanation')
    .eq('question_id', 'suf-8')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Question ID:', data.question_id);
  console.log('\n=== HINT ===');
  console.log(data.hint);
  console.log('\n=== EXPLANATION ===');
  console.log(data.explanation);
  console.log('\n=== CHECKING FOR ESCAPED NEWLINES ===');
  console.log('Has \\n in hint:', data.hint?.includes('\\n'));
  console.log('Has \\n in explanation:', data.explanation?.includes('\\n'));
}

checkQuestion();

