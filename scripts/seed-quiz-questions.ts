import { createClient } from '@supabase/supabase-js';
import quizData from '../public/data/medical-terminology-questions.json';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars: Record<string, string> = {};

envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=:#]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedQuestions() {
  console.log('🌱 Starting quiz questions seed...\n');

  const sections = ['fundamentals', 'prefixes', 'suffixes', 'roots', 'abbreviations', 'positioning'];
  
  for (const sectionKey of sections) {
    const sectionData = quizData.sections[sectionKey as keyof typeof quizData.sections];
    
    if (!sectionData) {
      console.log(`⚠️  Section "${sectionKey}" not found in JSON, skipping...`);
      continue;
    }

    console.log(`📚 Seeding ${sectionKey} section (${sectionData.questions.length} questions)...`);

    for (let i = 0; i < sectionData.questions.length; i++) {
      const q = sectionData.questions[i];
      
      const questionData = {
        section_key: sectionKey,
        question_id: q.id,
        question_type: q.type,
        question_text: q.question,
        answers: q.answers,
        correct_answer: q.correctAnswer,
        points: q.points,
        order_index: i,
      };

      const { error } = await supabase
        .from('quiz_questions')
        .upsert(questionData, {
          onConflict: 'question_id',
        });

      if (error) {
        console.error(`  ❌ Error inserting question ${q.id}:`, error.message);
      } else {
        process.stdout.write(`  ✓ ${q.id} `);
        if ((i + 1) % 10 === 0) console.log(`(${i + 1}/${sectionData.questions.length})`);
      }
    }
    
    console.log(`\n  ✅ Completed ${sectionKey}\n`);
  }

  // Verify
  const { data: questionCount } = await supabase
    .from('quiz_questions')
    .select('*', { count: 'exact', head: true });

  console.log(`\n✨ Seed complete! Total questions in database: ${questionCount?.length || 0}\n`);
}

seedQuestions()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });

