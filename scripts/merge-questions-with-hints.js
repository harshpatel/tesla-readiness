require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function mergeQuestionsWithHints() {
  console.log('🔍 Fetching all quiz questions from database...\n');
  
  const { data: questions, error } = await supabase
    .from('quiz_questions')
    .select('question_id, section_key, question_type, question_text, answers, correct_answer, image_url')
    .order('section_key', { ascending: true })
    .order('order_index', { ascending: true });

  if (error) {
    console.error('❌ Error fetching questions:', error);
    return;
  }

  console.log(`✅ Fetched ${questions.length} questions\n`);

  // Group by section_key
  const sectionGroups = {};
  questions.forEach(q => {
    if (!sectionGroups[q.section_key]) {
      sectionGroups[q.section_key] = [];
    }
    sectionGroups[q.section_key].push(q);
  });

  const hintsDir = path.join(process.cwd(), 'public/data/quiz-hints');
  let updatedFiles = 0;

  // Process each section
  for (const [sectionKey, sectionQuestions] of Object.entries(sectionGroups)) {
    const hintFilePath = path.join(hintsDir, `${sectionKey}.json`);
    
    if (!fs.existsSync(hintFilePath)) {
      console.log(`⚠️  No hints file for ${sectionKey}, skipping...`);
      continue;
    }

    // Load existing hints
    const existingHints = JSON.parse(fs.readFileSync(hintFilePath, 'utf8'));
    
    // Merge question data with hints
    const merged = {};
    sectionQuestions.forEach(q => {
      const existingHint = existingHints[q.question_id] || {};
      
      merged[q.question_id] = {
        // Question data from DB
        question_type: q.question_type,
        question_text: q.question_text,
        answers: q.answers,
        correct_answer: q.correct_answer,
        ...(q.image_url && { image_url: q.image_url }),
        
        // Hints/explanations from JSON
        hint: existingHint.hint || '',
        explanation: existingHint.explanation || ''
      };
    });

    // Write back to file
    fs.writeFileSync(hintFilePath, JSON.stringify(merged, null, 2));
    console.log(`✅ Updated ${sectionKey}.json (${sectionQuestions.length} questions)`);
    updatedFiles++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Updated ${updatedFiles} hint files`);
  console.log(`📝 Total questions: ${questions.length}`);
  console.log(`\n🎉 All files now include full question context!`);
}

mergeQuestionsWithHints();

