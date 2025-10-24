const fs = require('fs');
const path = require('path');

// Load quiz data files
const medTermData = require('../public/data/medical-terminology-questions.json');
const introMriData = require('../public/data/introduction-to-mri-questions.json');

function generateQuizMigration(quizData, moduleName, moduleSlug, migrationNumber) {
  let sql = `-- Migration ${migrationNumber}: Insert quiz questions for ${moduleName}
-- This migration inserts all quiz questions into the quiz_questions table

DO $$
DECLARE
  v_module_id UUID;
`;

  // Process each section in the quiz
  const sections = Object.keys(quizData.sections);
  
  sections.forEach((sectionKey, sectionIdx) => {
    const section = quizData.sections[sectionKey];
    const varName = sectionKey.replace(/-/g, '_'); // Replace hyphens with underscores for SQL variable names
    sql += `  v_${varName}_content_id UUID;\n`;
  });

  sql += `BEGIN
  -- Get module ID for '${moduleSlug}'
  SELECT m.id INTO v_module_id 
  FROM modules m
  JOIN sections s ON m.section_id = s.id
  WHERE m.slug = '${moduleSlug}';

  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Module ${moduleSlug} not found';
  END IF;

  -- Insert or update quiz_sections for each section
`;

  sections.forEach((sectionKey, sectionIdx) => {
    const section = quizData.sections[sectionKey];
    sql += `  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('${sectionKey}', '${section.title.replace(/'/g, "''")}', '${(section.description || '').replace(/'/g, "''")}', '📝', ${sectionIdx})
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();

`;
  });

  sql += `\n`;

  // For each section, get or create the content item
  sections.forEach((sectionKey, sectionIdx) => {
    const section = quizData.sections[sectionKey];
    const varName = sectionKey.replace(/-/g, '_'); // Replace hyphens with underscores for SQL variable names
    
    sql += `  -- Get or create content item for ${sectionKey}
  SELECT id INTO v_${varName}_content_id
  FROM content_items
  WHERE module_id = v_module_id AND slug = '${sectionKey}' AND type = 'quiz';

  IF v_${varName}_content_id IS NULL THEN
    INSERT INTO content_items (
      module_id,
      slug,
      title,
      description,
      type,
      icon,
      order_index,
      metadata,
      is_published
    ) VALUES (
      v_module_id,
      '${sectionKey}',
      '${section.title.replace(/'/g, "''")}',
      '${(section.description || '').replace(/'/g, "''")}',
      'quiz',
      '📝',
      ${sectionIdx + 1},
      '{}',
      true
    ) RETURNING id INTO v_${varName}_content_id;
  END IF;

  -- Delete existing questions for this section (if any)
  DELETE FROM quiz_questions WHERE content_item_id = v_${varName}_content_id;

  -- Insert questions for ${sectionKey}
  INSERT INTO quiz_questions (
    content_item_id,
    question_id,
    section_key,
    question_type,
    question_text,
    answers,
    correct_answer,
    points,
    order_index
  ) VALUES\n`;

    // Add each question
    const questions = section.questions;
    questions.forEach((q, qIdx) => {
      const isLast = qIdx === questions.length - 1;
      const answersJson = JSON.stringify(q.answers).replace(/'/g, "''");
      const questionText = q.question.replace(/'/g, "''");
      
      sql += `    (v_${varName}_content_id, '${q.id}', '${sectionKey}', '${q.type}', '${questionText}', '${answersJson}', '${q.correctAnswer}', ${q.points || 1}, ${qIdx})${isLast ? ';' : ','}\n`;
    });

    sql += `\n`;
  });

  sql += `  RAISE NOTICE 'Successfully inserted questions for ${moduleName}';
END $$;
`;

  return sql;
}

// Generate migrations
const medTermMigration = generateQuizMigration(
  medTermData,
  'Medical Terminology',
  'medical-terminology',
  '024'
);

const introMriMigration = generateQuizMigration(
  introMriData,
  'Introduction to MRI',
  'introduction-to-mri',
  '025'
);

// Write migration files
fs.writeFileSync(
  path.join(__dirname, '../supabase/migrations/024_add_medical_terminology_questions.sql'),
  medTermMigration
);

fs.writeFileSync(
  path.join(__dirname, '../supabase/migrations/025_add_intro_mri_questions.sql'),
  introMriMigration
);

console.log('✅ Migration files generated successfully!');
console.log('   - 024_add_medical_terminology_questions.sql');
console.log('   - 025_add_intro_mri_questions.sql');

