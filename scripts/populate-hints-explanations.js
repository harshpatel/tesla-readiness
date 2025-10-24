const fs = require('fs');
const path = require('path');

// Load quiz data files
const medTermData = require('../public/data/medical-terminology-questions.json');
const introMriData = require('../public/data/introduction-to-mri-questions.json');
const anatomyData = require('../public/data/general-anatomy-physiology-questions.json');

function generateUpdateSQL() {
  let sql = `-- Update quiz_questions with hints and explanations from JSON files

DO $$
BEGIN
  RAISE NOTICE 'Updating hints and explanations for quiz questions...';

`;

  const datasets = [
    { name: 'Medical Terminology', data: medTermData },
    { name: 'Introduction to MRI', data: introMriData },
    { name: 'General Anatomy & Physiology', data: anatomyData },
  ];

  datasets.forEach(({ name, data }) => {
    sql += `  -- ${name}\n`;
    
    Object.keys(data.sections).forEach(sectionKey => {
      const section = data.sections[sectionKey];
      
      section.questions.forEach(q => {
        const hint = (q.hint || '').replace(/'/g, "''");
        const explanation = (q.explanation || '').replace(/'/g, "''");
        
        sql += `  UPDATE quiz_questions
  SET 
    hint = '${hint}',
    explanation = '${explanation}',
    updated_at = NOW()
  WHERE question_id = '${q.id}';

`;
      });
    });
    
    sql += `\n`;
  });

  sql += `  RAISE NOTICE 'Successfully updated hints and explanations';
END $$;
`;

  return sql;
}

// Generate the SQL
const updateSQL = generateUpdateSQL();

// Append to the migration file
fs.appendFileSync(
  path.join(__dirname, '../supabase/migrations/026_add_hints_explanations_to_quiz_questions.sql'),
  '\n' + updateSQL
);

console.log('✅ Added UPDATE statements to migration file!');
console.log('   - 026_add_hints_explanations_to_quiz_questions.sql');

