require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

if (!openaiApiKey) {
  console.error('Missing OpenAI API key. Please add OPENAI_API_KEY to .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

async function convertToMarkdown(text, type) {
  if (!text) return null;
  
  const prompt = type === 'hint' 
    ? `Take this quiz hint text and give it back to me in proper Markdown format. Feel free to edit it to your liking to make it formatted nicer and more readable.

Input text:
${text}

Make it:
- Clean and well-formatted markdown
- Short and memorable
- Easy to read with proper spacing
- Keep all emojis
- Use bold, italics, line breaks as needed

Output only the markdown-formatted text, no explanations or preamble.`
    : `Take this quiz explanation text and give it back to me in proper Markdown format. Feel free to edit it to your liking to make it formatted nicer and more readable.

Input text:
${text}

Make it:
- Clean and well-formatted markdown
- Easy to read with proper paragraph breaks and spacing
- Use bold, italics, bullet points, line breaks as needed
- Keep all emojis and fun elements
- Preserve the structure (definition + 💡 Remember it: section)
- Make it engaging and memorable

Output only the markdown-formatted text, no explanations or preamble.`;

  try {
    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: prompt,
      reasoning: { effort: "low" },
      text: { verbosity: "low" }
    });

    return response.output_text.trim();
  } catch (error) {
    console.error(`Error converting ${type}:`, error.message);
    return text; // Return original if conversion fails
  }
}

async function convertAllQuestions() {
  console.log('🔍 Fetching all quiz questions...');
  
  const { data: questions, error } = await supabase
    .from('quiz_questions')
    .select('id, question_id, hint, explanation')
    .order('id');

  if (error) {
    console.error('Error fetching questions:', error);
    return;
  }

  console.log(`📝 Found ${questions.length} questions to convert\n`);

  let converted = 0;
  let skipped = 0;
  let errors = 0;
  const startTime = Date.now();

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const remaining = questions.length - i - 1;
    
    console.log(`Processing: ${question.question_id} (ID: ${question.id})`);
    
    let updatedHint = question.hint;
    let updatedExplanation = question.explanation;
    let needsUpdate = false;

    // Convert hint if it exists
    if (question.hint) {
      console.log('  Reformatting hint with GPT-5-mini...');
      updatedHint = await convertToMarkdown(question.hint, 'hint');
      needsUpdate = true;
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit
    }

    // Convert explanation if it exists
    if (question.explanation) {
      console.log('  Reformatting explanation with GPT-5-mini...');
      updatedExplanation = await convertToMarkdown(question.explanation, 'explanation');
      needsUpdate = true;
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit
    }

    if (needsUpdate) {
      // Update the database
      const { error: updateError } = await supabase
        .from('quiz_questions')
        .update({
          hint: updatedHint,
          explanation: updatedExplanation,
          updated_at: new Date().toISOString()
        })
        .eq('id', question.id);

      if (updateError) {
        console.error(`  ❌ Error updating question ${question.id}:`, updateError.message);
        errors++;
      } else {
        console.log(`  ✅ Reformatted and updated`);
        converted++;
      }
    } else {
      console.log(`  ⏭️  Skipped (no content)`);
      skipped++;
    }
    
    // Calculate and display time estimate
    const elapsed = Date.now() - startTime;
    const avgTimePerQuestion = elapsed / (i + 1);
    const estimatedRemaining = (avgTimePerQuestion * remaining) / 1000; // in seconds
    const minutes = Math.floor(estimatedRemaining / 60);
    const seconds = Math.floor(estimatedRemaining % 60);
    
    console.log(`⏱️  ${remaining} remaining (~${minutes}m ${seconds}s)\n`);
  }

  console.log('\n📊 Summary:');
  console.log(`✅ Converted: ${converted}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📝 Total: ${questions.length}`);
}

// Run the conversion
convertAllQuestions()
  .then(() => {
    console.log('\n🎉 Conversion complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });

