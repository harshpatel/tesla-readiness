require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mapping of slug to order number
const QUIZ_ORDER = {
  'introduction-quiz': '01',
  'fundamentals': '02',
  'prefixes': '03',
  'suffixes': '04',
  'roots': '05',
  'abbreviations': '06',
  'positioning': '07',
  'anatomy-fundamentals': '08',
  'neuro-procedures-fundamentals': '09',
  'body-msk-fundamentals': '10'
};

async function createNumberedHintFiles() {
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
  
  // Clear existing files
  if (fs.existsSync(hintsDir)) {
    fs.readdirSync(hintsDir).forEach(file => {
      fs.unlinkSync(path.join(hintsDir, file));
    });
  } else {
    fs.mkdirSync(hintsDir, { recursive: true });
  }

  let createdFiles = 0;

  // Create a file for each section
  for (const [sectionKey, sectionQuestions] of Object.entries(sectionGroups)) {
    const orderNumber = QUIZ_ORDER[sectionKey];
    if (!orderNumber) {
      console.log(`⚠️  No order number defined for ${sectionKey}, skipping...`);
      continue;
    }

    const hints = {};
    sectionQuestions.forEach(q => {
      hints[q.question_id] = {
        question_type: q.question_type,
        question_text: q.question_text,
        answers: q.answers,
        correct_answer: q.correct_answer,
        ...(q.image_url && { image_url: q.image_url }),
        hint: '',
        explanation: ''
      };
    });

    const fileName = `${orderNumber}-${sectionKey}.json`;
    const filePath = path.join(hintsDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(hints, null, 2));
    
    console.log(`✅ Created ${fileName} (${sectionQuestions.length} questions)`);
    createdFiles++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`✅ Created ${createdFiles} numbered hint files`);
  console.log(`📝 Total questions: ${questions.length}`);
}

createNumberedHintFiles();

