const fs = require('fs');
const path = require('path');

// Load all questions with hints
const allQuestions = JSON.parse(fs.readFileSync('all-quiz-questions.json', 'utf8'));

// Group by section_key
const sections = {};
allQuestions.forEach(q => {
  if (!sections[q.section_key]) {
    sections[q.section_key] = {};
  }
  
  sections[q.section_key][q.question_id] = {
    hint: q.hint || '',
    explanation: q.explanation || ''
  };
});

// Create directory if it doesn't exist
const hintsDir = 'public/data/quiz-hints';
if (!fs.existsSync(hintsDir)) {
  fs.mkdirSync(hintsDir, { recursive: true });
}

// Write a JSON file for each section
let totalSections = 0;
let totalQuestions = 0;

for (const [sectionKey, hints] of Object.entries(sections)) {
  const fileName = `${sectionKey}.json`;
  const filePath = path.join(hintsDir, fileName);
  
  fs.writeFileSync(filePath, JSON.stringify(hints, null, 2));
  
  const questionCount = Object.keys(hints).length;
  totalSections++;
  totalQuestions += questionCount;
  
  console.log(`✅ Created ${fileName} (${questionCount} questions)`);
}

console.log(`\n📊 Summary:`);
console.log(`✅ Created ${totalSections} hint files`);
console.log(`📝 Total questions: ${totalQuestions}`);

