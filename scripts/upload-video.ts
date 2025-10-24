/**
 * Script to upload videos to Supabase Storage
 * 
 * Usage:
 *   npx tsx scripts/upload-video.ts <path-to-video-file> <storage-filename>
 * 
 * Example:
 *   npx tsx scripts/upload-video.ts ~/Downloads/intro-video.mp4 introduction-to-mri.mp4
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadVideo(localPath: string, storagePath: string) {
  try {
    console.log('📁 Reading file:', localPath);
    
    // Read the file
    const fileBuffer = fs.readFileSync(localPath);
    const fileExt = path.extname(localPath);
    const contentType = fileExt === '.mp4' ? 'video/mp4' : 
                        fileExt === '.mov' ? 'video/quicktime' :
                        fileExt === '.webm' ? 'video/webm' :
                        'video/mp4';
    
    console.log('📤 Uploading to Supabase Storage...');
    console.log('   Bucket: videos');
    console.log('   Path:', storagePath);
    console.log('   Size:', (fileBuffer.length / 1024 / 1024).toFixed(2), 'MB');
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error('❌ Upload failed:', error.message);
      process.exit(1);
    }

    console.log('✅ Upload successful!');
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(storagePath);

    console.log('\n📺 Video URL:', publicUrl);
    console.log('\n💡 Use this URL in your content_items metadata:');
    console.log(`   { "videoUrl": "${publicUrl}" }`);
    
    return publicUrl;
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('Usage: npx tsx scripts/upload-video.ts <local-file-path> <storage-filename>');
  console.log('');
  console.log('Example:');
  console.log('  npx tsx scripts/upload-video.ts ~/Downloads/intro.mp4 introduction-to-mri.mp4');
  process.exit(1);
}

const [localPath, storagePath] = args;

// Check if file exists
if (!fs.existsSync(localPath)) {
  console.error('❌ File not found:', localPath);
  process.exit(1);
}

// Run the upload
uploadVideo(localPath, storagePath);

