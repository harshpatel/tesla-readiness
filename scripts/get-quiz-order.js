require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function getQuizOrder() {
  // Get all sections with modules and their quiz content items
  const { data: sections } = await supabase
    .from('sections')
    .select('id, slug, title, order_index')
    .order('order_index');

  let overallQuizNumber = 1;

  for (const section of sections) {
    console.log(`\n📚 ${section.title} (${section.slug})`);
    
    const { data: modules } = await supabase
      .from('modules')
      .select('id, slug, title, order_index')
      .eq('section_id', section.id)
      .order('order_index');

    for (const module of modules) {
      const { data: quizzes } = await supabase
        .from('content_items')
        .select('slug, title, order_index, type')
        .eq('module_id', module.id)
        .eq('type', 'quiz')
        .order('order_index');

      if (quizzes && quizzes.length > 0) {
        console.log(`  📝 ${module.title} (${module.slug})`);
        quizzes.forEach((quiz) => {
          console.log(`     ${overallQuizNumber}. ${quiz.slug}`);
          overallQuizNumber++;
        });
      }
    }
  }
}

getQuizOrder();

