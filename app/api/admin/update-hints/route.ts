import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// Mapping of quiz slug to numbered hint file
const QUIZ_FILE_NUMBERS: Record<string, string> = {
  'introduction-quiz': '01',
  'fundamentals': '02',
  'prefixes': '03',
  'suffixes': '04',
  'roots': '05',
  'abbreviations': '06',
  'positioning': '07',
  'anatomy-fundamentals': '08',
  'neuro-procedures-fundamentals': '09',
  'body-msk-fundamentals': '10',
};

export async function POST(request: Request) {
  console.log('\n🟢 [API] /api/admin/update-hints called');
  
  // Check if user is admin
  const userIsAdmin = await isAdmin();
  if (!userIsAdmin) {
    console.error('❌ [API] Unauthorized access attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  console.log('✅ [API] Admin check passed');

  try {
    const { sectionKey, questionId, updates } = await request.json();
    console.log('📥 [API] Request payload:', { sectionKey, questionId, updates });

    if (!sectionKey || !questionId || !updates) {
      console.error('❌ [API] Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine the file path
    const fileNumber = QUIZ_FILE_NUMBERS[sectionKey];
    const fileName = fileNumber ? `${fileNumber}-${sectionKey}.json` : `${sectionKey}.json`;
    const filePath = path.join(process.cwd(), 'public', 'data', 'quiz-hints', fileName);
    console.log('📁 [API] Target file:', fileName);
    console.log('📂 [API] Full path:', filePath);

    // Read current file
    if (!fs.existsSync(filePath)) {
      console.error('❌ [API] Hints file not found at:', filePath);
      return NextResponse.json({ error: 'Hints file not found' }, { status: 404 });
    }

    console.log('📖 [API] Reading existing hints file...');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const hintsData = JSON.parse(fileContent);
    console.log('✅ [API] Hints file loaded successfully');

    // Update the specific question's hints/explanations
    if (!hintsData[questionId]) {
      console.error('❌ [API] Question not found in hints file:', questionId);
      return NextResponse.json({ error: 'Question not found in hints file' }, { status: 404 });
    }

    console.log('🔄 [API] Updating question hints...');
    console.log('📝 [API] Before:', hintsData[questionId]);
    
    hintsData[questionId] = {
      ...hintsData[questionId],
      ...updates
    };
    
    console.log('📝 [API] After:', hintsData[questionId]);

    // Write back to file
    console.log('💾 [API] Writing updated data to JSON file...');
    fs.writeFileSync(filePath, JSON.stringify(hintsData, null, 2), 'utf8');
    console.log('✅ [API] JSON file updated successfully!');

    return NextResponse.json({ success: true, data: hintsData[questionId] });
  } catch (error: any) {
    console.error('💥 [API] Unexpected error in update-hints route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

