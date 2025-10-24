import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addMedicalTerminologyVideo() {
  console.log('🚀 Adding Medical Terminology video...');
  
  // Step 1: Get the medical-terminology module ID
  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .select('id')
    .eq('slug', 'medical-terminology')
    .single();
  
  if (moduleError || !moduleData) {
    console.error('❌ Error fetching module:', moduleError);
    return;
  }
  
  console.log('✅ Found medical-terminology module:', moduleData.id);
  
  // Step 2: Get existing content items and update their order
  console.log('📝 Fetching existing content items...');
  const { data: existingItems, error: fetchError } = await supabase
    .from('content_items')
    .select('*')
    .eq('module_id', moduleData.id)
    .eq('type', 'quiz')
    .in('slug', ['prefixes', 'suffixes', 'roots', 'abbreviations', 'positioning']);
  
  if (fetchError) {
    console.error('❌ Error fetching items:', fetchError);
  } else {
    console.log(`✅ Found ${existingItems?.length} quiz items to update`);
    
    // Update each item's order_index
    for (const item of existingItems || []) {
      const { error: updateError } = await supabase
        .from('content_items')
        .update({ order_index: item.order_index + 1 })
        .eq('id', item.id);
      
      if (updateError) {
        console.error(`❌ Error updating ${item.slug}:`, updateError);
      } else {
        console.log(`  ✓ Updated ${item.slug}: ${item.order_index} → ${item.order_index + 1}`);
      }
    }
  }
  
  // Step 3: Insert the video content item
  console.log('📹 Inserting video content item...');
  const { data: videoData, error: insertError } = await supabase
    .from('content_items')
    .insert({
      module_id: moduleData.id,
      type: 'video',
      slug: 'medical-terminology-intro',
      title: 'Introduction to Medical Terminology',
      description: 'Learn the fundamentals of medical terminology and how it applies to MRI',
      icon: '📹',
      order_index: 0,
      is_published: true,
      metadata: {
        videoUrl: 'https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/Medical%20Terminology.mp4'
      }
    })
    .select();
  
  if (insertError) {
    console.error('❌ Error inserting video:', insertError);
    
    // Try upsert instead
    console.log('🔄 Trying upsert...');
    const { data: upsertData, error: upsertError } = await supabase
      .from('content_items')
      .upsert({
        module_id: moduleData.id,
        type: 'video',
        slug: 'medical-terminology-intro',
        title: 'Introduction to Medical Terminology',
        description: 'Learn the fundamentals of medical terminology and how it applies to MRI',
        icon: '📹',
        order_index: 0,
        is_published: true,
        metadata: {
          videoUrl: 'https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/videos/Medical%20Terminology.mp4'
        }
      }, {
        onConflict: 'module_id,slug'
      })
      .select();
    
    if (upsertError) {
      console.error('❌ Upsert also failed:', upsertError);
    } else {
      console.log('✅ Video upserted successfully:', upsertData);
    }
  } else {
    console.log('✅ Video inserted successfully:', videoData);
  }
  
  // Step 4: Verify the final state
  console.log('\n🔍 Verifying final content items...');
  const { data: contentItems, error: verifyError } = await supabase
    .from('content_items')
    .select('*')
    .eq('module_id', moduleData.id)
    .order('order_index');
  
  if (verifyError) {
    console.error('❌ Error verifying:', verifyError);
    return;
  }
  
  console.log('\n📊 Content items for Medical Terminology:');
  contentItems?.forEach((item: any) => {
    console.log(`  ${item.order_index}: ${item.icon} ${item.title} (${item.type}) - ${item.slug}`);
  });
  
  console.log('\n✅ Done!');
}

addMedicalTerminologyVideo().catch(console.error);

