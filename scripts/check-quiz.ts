import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  const { data } = await supabase
    .from('quiz_questions')
    .select('question_id, question_text, answers, correct_answer')
    .eq('section_key', 'subatomic-principles-fundamentals')
    .order('order_index')
    .limit(10);

  console.log('First 10 questions from Subatomic Principles quiz:\n');
  data?.forEach((q, i) => {
    console.log(`${i + 1}. ${q.question_text}`);
    console.log(`   Answers: ${q.answers}`);
    console.log(`   Correct: ${q.correct_answer}\n`);
  });
}

check();
