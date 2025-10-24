# Module Creation Template

> **Instructions:** Just fill in the basics below. The AI will figure out everything else (descriptions, icons, positioning, formatting, etc.)

---

## Required Info

**Module Name:** 
`[What should we call this module?]`

**Section:** 
`[Phase 1, Phase 2, Onboarding, Clinical, or Registry]`

**Position:** 
`[Where should it go? e.g., "first", "after Medical Terminology", "at the end"]`

---

## Content (Paste what you have)

**Video URL (if any):**
```
[Supabase Storage URL or leave blank]
```

**Quiz Questions (if any):**
```
[Just paste your questions in ANY format - AI will parse and structure them]

Examples of formats the AI understands:
- Plain text
- Numbered lists
- Quiz platform exports
- Word doc copy/paste
- Whatever you have!
```

**Document URL (if any):**
```
[URL to reading material or leave blank]
```

---

## Optional Notes

```
[Anything else the AI should know? Leave blank if nothing special]
```

---

## Example

**Module Name:** Physics of MRI

**Section:** Phase 1

**Position:** after Introduction to MRI

**Video URL:**
```
https://xyz.supabase.co/storage/v1/object/public/videos/mri-physics.mp4
```

**Quiz Questions:**
```
1. What is the primary magnetic field strength in most clinical MRI scanners?
a) 0.5 Tesla
b) 1.5 Tesla
c) 3.0 Tesla
d) Both b and c
Answer: d

2. MRI uses ionizing radiation - True or False
Answer: False
```

**Document URL:**
```
[leave blank]
```

**Optional Notes:**
```
Make sure to emphasize safety aspects
```

---

## What Happens Next

Give this to the AI and it will automatically do everything!

---

## AI PROCESSING INSTRUCTIONS (For the AI Assistant)

When a user provides a filled-out template, follow these steps IN ORDER:

### Step 1: Parse & Understand
1. Read the filled template carefully
2. Identify what content types exist (video/quiz/document)
3. Note the target section and position
4. Check if there are any special notes

### Step 2: Query Existing Structure
1. Check the database for existing sections and their IDs
2. Query all modules in the target section to determine order_index
3. If position is "first", set order_index = 1
4. If position is "after [module name]", find that module's order_index and add 1
5. If position is "at the end", find max order_index and add 1

### Step 3: Generate Module Details
1. **Create slug**: Convert module name to lowercase-kebab-case
2. **Write description**: Create compelling 1-2 sentence description of what students will learn
3. **Choose icon**: Pick a perfect emoji that represents the topic
4. **Set published**: Default to true unless user specified otherwise

### Step 4: Process Content Items
For each content type present:

**If Video:**
- Generate video title (based on module name if not provided)
- Create description
- Set type: "video"
- Create slug: "introduction" or meaningful name
- Store video URL in metadata.videoUrl
- Set order_index: 1

**If Quiz:**
- Parse questions from ANY format provided
- Intelligently detect: question text, answers, correct answer, explanations
- If multiple choice: extract options A/B/C/D
- If true/false: detect boolean questions
- Generate question IDs (slugs)
- Create JSON structure with proper format
- Determine if multiple quiz sections needed (or just one)
- Create quiz slugs: "fundamentals", "basics", etc.
- Set order_index appropriately

**If Document:**
- Generate document title
- Create description
- Set type: "document"
- Create slug
- Store URL in metadata.documentUrl
- Set order_index appropriately

### Step 5: Create SQL Migration File
Generate a new migration file: `XXX_add_[module-slug]_module.sql`

Include:
```sql
-- Get section ID
DO $$
DECLARE
  v_section_id UUID;
  v_module_id UUID;
  v_content_id UUID;
BEGIN
  -- Get section ID
  SELECT id INTO v_section_id FROM sections WHERE slug = '[section-slug]';
  
  -- Insert module
  INSERT INTO modules (section_id, slug, title, description, icon, order_index, is_published, is_locked)
  VALUES (v_section_id, '[module-slug]', '[Module Name]', '[Description]', '[Emoji]', [order_index], true, false)
  RETURNING id INTO v_module_id;
  
  -- Insert video content (if exists)
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'introduction', '[Video Title]', '[Description]', 'video', '🎥', 1, '{"videoUrl": "[URL]"}', true)
  RETURNING id INTO v_content_id;
  
  -- Insert quiz content (if exists)
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, '[quiz-slug]', '[Quiz Title]', '[Description]', 'quiz', '📝', 2, '{}', true)
  RETURNING id INTO v_content_id;
  
  -- Insert quiz questions
  INSERT INTO quiz_questions (content_item_id, question_id, section_key, question_type, question_text, answers, correct_answer, points, order_index, hint, explanation)
  VALUES 
    (v_content_id, '[slug-1]', '[quiz-slug]', 'multiplechoice', '[Question]', '[JSON]', '[Answer]', 1, 0, null, '[Explanation]'),
    -- ... more questions
  ;
  
  -- Insert document (if exists)
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'reading', '[Doc Title]', '[Description]', 'document', '📄', 3, '{"documentUrl": "[URL]"}', true);
  
END $$;
```

### Step 6: Create JSON Files (if quiz exists)
Create: `public/data/[module-slug]-questions.json`

Format:
```json
{
  "sections": {
    "[quiz-slug]": {
      "title": "[Quiz Section Title]",
      "description": "[Description]",
      "questions": [
        {
          "id": "[question-slug]",
          "type": "multiplechoice" | "truefalse",
          "question": "[Question text]",
          "answers": {"a": "...", "b": "...", "c": "...", "d": "..."},
          "correctAnswer": "a",
          "points": 1,
          "hint": "...",
          "explanation": "..."
        }
      ]
    }
  }
}
```

### Step 7: Update Quiz Page (if quiz exists)
Update: `app/[section]/[module]/quiz/[slug]/page.tsx`

Add import for new JSON file:
```typescript
import [moduleName]QuizData from '@/public/data/[module-slug]-questions.json';
```

Add to QUIZ_DATA_MAP:
```typescript
const QUIZ_DATA_MAP: Record<string, any> = {
  // ... existing
  '[module-slug]': [moduleName]QuizData,
};
```

### Step 8: Execute Migration
1. Save the SQL migration file
2. Ask user to confirm before running
3. Run the migration: Connect to Supabase and execute SQL
4. Verify: Query to confirm module, content_items, and questions were created

### Step 9: Verify Everything Works
1. Check that module appears in sidebar
2. Verify video page loads (if exists)
3. Verify quiz page loads with questions (if exists)
4. Verify document page loads (if exists)
5. Test navigation between content items
6. Confirm progress tracking works

### Step 10: Report Back
Provide summary:
- ✅ Module created: [name]
- ✅ Position: [section] at order_index [X]
- ✅ Content items: [list]
- ✅ Quiz questions: [count]
- ✅ Migration file: [filename]
- ✅ JSON file: [filename] (if applicable)
- ✅ All verified and working!

---

**IMPORTANT REMINDERS FOR AI:**
- Always use UUIDs properly with gen_random_uuid()
- Always check existing order_index values before assigning
- Parse quiz questions intelligently - handle messy formatting
- Generate meaningful slugs (lowercase-kebab-case)
- Create proper metadata JSON for videos/documents
- Test everything before confirming completion
- If anything is unclear, ASK the user before proceeding

