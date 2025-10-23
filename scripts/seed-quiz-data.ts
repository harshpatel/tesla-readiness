/**
 * Seed Quiz Data from JSON to Supabase
 * 
 * This script reads medical-terminology-questions.json and populates
 * the quiz_sections and quiz_questions tables in Supabase.
 * 
 * Run with: npx tsx scripts/seed-quiz-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface QuizData {
  title: string;
  sections: {
    [key: string]: {
      title: string;
      description: string;
      questions: Array<{
        id: string;
        type: 'multiplechoice' | 'truefalse';
        question: string;
        points: number;
        correctAnswer: string;
        answers: Record<string, string>;
      }>;
    };
  };
}

const SECTION_ICONS: Record<string, string> = {
  suffixes: '📝',
  prefixes: '🔤',
  roots: '🌿',
  abbreviations: '📋',
  positioning: '🧍',
};

async function seedQuizData() {
  console.log('🌱 Starting quiz data seed...\n');

  // Read JSON file
  const jsonPath = path.join(process.cwd(), 'public/data/medical-terminology-questions.json');
  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const quizData: QuizData = JSON.parse(jsonData);

  console.log(`📚 Loaded: ${quizData.title}`);
  console.log(`📂 Sections: ${Object.keys(quizData.sections).length}\n`);

  // Clear existing data (optional - comment out if you want to preserve data)
  console.log('🗑️  Clearing existing quiz data...');
  await supabase.from('quiz_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('quiz_sections').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Cleared existing data\n');

  // Insert parent section (Medical Terminology)
  console.log('📝 Inserting parent section...');
  const { error: parentError } = await supabase
    .from('quiz_sections')
    .insert({
      key: 'medical-terminology',
      parent_key: null,
      title: 'Medical Terminology',
      description: 'Essential medical terminology for clinical readiness',
      icon: '📚',
      order_index: 0,
    });

  if (parentError) {
    console.error('❌ Error inserting parent section:', parentError);
    process.exit(1);
  }
  console.log('✅ Parent section created\n');

  // Insert sections and questions
  let sectionIndex = 0;
  for (const [sectionKey, sectionData] of Object.entries(quizData.sections)) {
    console.log(`📂 Processing section: ${sectionData.title} (${sectionKey})`);

    // Insert section
    const { error: sectionError } = await supabase
      .from('quiz_sections')
      .insert({
        key: sectionKey,
        parent_key: 'medical-terminology',
        title: sectionData.title,
        description: sectionData.description,
        icon: SECTION_ICONS[sectionKey] || '📝',
        order_index: sectionIndex++,
      });

    if (sectionError) {
      console.error(`❌ Error inserting section ${sectionKey}:`, sectionError);
      continue;
    }

    console.log(`   ✅ Section created`);

    // Insert questions for this section
    const questions = sectionData.questions.map((q, idx) => ({
      section_key: sectionKey,
      question_id: q.id,
      question_type: q.type,
      question_text: q.question,
      answers: q.answers,
      correct_answer: q.correctAnswer,
      points: q.points,
      order_index: idx,
    }));

    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questions);

    if (questionsError) {
      console.error(`❌ Error inserting questions for ${sectionKey}:`, questionsError);
      continue;
    }

    console.log(`   ✅ Inserted ${questions.length} questions\n`);
  }

  console.log('🎉 Quiz data seed completed successfully!');
  console.log('\n📊 Summary:');
  
  const { count: sectionsCount } = await supabase
    .from('quiz_sections')
    .select('*', { count: 'exact', head: true });
  
  const { count: questionsCount } = await supabase
    .from('quiz_questions')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   Sections: ${sectionsCount}`);
  console.log(`   Questions: ${questionsCount}`);
}

seedQuizData().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});

