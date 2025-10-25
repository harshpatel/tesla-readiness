import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('🚀 Running migration 023: Add numerical prefixes to modules...\n');

    // Get Phase 1 section ID
    const { data: section } = await supabase
      .from('sections')
      .select('id')
      .eq('slug', 'phase1')
      .single();

    if (!section) {
      console.error('❌ Phase 1 section not found');
      process.exit(1);
    }

    const phase1Id = section.id;
    console.log(`✅ Found Phase 1 section: ${phase1Id}\n`);

    // Update each module title with numerical prefix
    const updates = [
      { slug: 'introduction-to-mri', title: '01 - Introduction to MRI' },
      { slug: 'medical-terminology', title: '02 - Medical Terminology' },
      { slug: 'general-anatomy-physiology', title: '03 - General Anatomy & Physiology' },
      { slug: 'subatomic-principles-mri', title: '04 - Subatomic Principles of MRI' },
      { slug: 'instrumentation-magnets', title: '05 - Instrumentation I: Magnets' },
      { slug: 'mri-safety-magnetic-fields', title: '06 - MRI Safety I: Magnetic Fields' },
      { slug: 'mri-safety-rf-gradient', title: '07 - MRI Safety II: RF & Gradient Safety' },
      { slug: 'mri-procedures-neuro', title: '08 - MRI Procedures & Set Up I: Neuro' },
      { slug: 'mri-procedures-body', title: '09 - MRI Procedures & Set Up II: Body' },
      { slug: 'mri-procedures-msk', title: '10 - MRI Procedures & Set Up III: MSK' },
      { slug: 'patient-care-management', title: '11 - Patient Care and Management' },
      { slug: 'cross-sectional-anatomy-neuro', title: '12 - Cross Sectional Anatomy I: Neuro' },
      { slug: 'image-contrast-mechanisms', title: '13 - Image Contrast Mechanisms' },
      { slug: 'phase1-final-exam', title: '14 - Phase 1 Final Exam' },
    ];

    console.log('📝 Updating module titles...\n');

    for (const update of updates) {
      const { error } = await supabase
        .from('modules')
        .update({ 
          title: update.title,
          updated_at: new Date().toISOString()
        })
        .eq('section_id', phase1Id)
        .eq('slug', update.slug);

      if (error) {
        console.error(`❌ Failed to update ${update.slug}:`, error);
      } else {
        console.log(`   ✅ ${update.title}`);
      }
    }

    console.log('\n✅ Migration executed successfully!\n');

    // Verify the changes
    console.log('📊 Verifying module titles...\n');
    
    const { data: modules } = await supabase
      .from('modules')
      .select('title, slug, order_index')
      .eq('section_id', phase1Id)
      .order('order_index');

    if (modules) {
      console.log('📚 Updated module titles:');
      modules.forEach(mod => {
        console.log(`   ${mod.order_index}. ${mod.title} (${mod.slug})`);
      });
    }

    console.log('\n✨ Migration complete!');
  } catch (error) {
    console.error('💥 Error running migration:', error);
    process.exit(1);
  }
}

runMigration();

