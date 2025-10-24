# Module Creation Template

> **Instructions:** Just fill in the basics below. The AI will figure out everything else (descriptions, icons, positioning, formatting, etc.)

---

## Required Info

**Module Name:**

**Section:**

**Position:**

**Video URL:**

**Quiz Questions:**

**Document URL:**

---

## Optional Notes

---

## Example

**Module Name:**
Physics of MRI

**Section:**
Phase 1

**Position:**
after Introduction to MRI

**Video URL:**
https://xyz.supabase.co/storage/v1/object/public/videos/mri-physics.mp4

**Quiz Questions:**
1. What is the primary magnetic field strength in most clinical MRI scanners?
a) 0.5 Tesla
b) 1.5 Tesla
c) 3.0 Tesla
d) Both b and c
Answer: d

2. MRI uses ionizing radiation - True or False
Answer: False

**Document URL:**

**Optional Notes:**
Make sure to emphasize safety aspects

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
- **ARCHITECTURE**: 
  - Quiz question data (text, answers, correct answer, image URL) → Database
  - Hints and explanations → JSON files in `/public/data/quiz-hints/`
  - This allows fast editing of hints/explanations without database migrations
- **IMPORTANT**: Generate hints and explanations in this EXACT style:

**NOTE:** These examples show the structure. Parse user's messy input and transform it into this format.

**MULTIPLE CHOICE EXAMPLE:**

**Database (quiz_questions table):**
```sql
-- Question data only (no hints/explanations in DB)
INSERT INTO quiz_questions (
  content_item_id, 
  question_id, 
  section_key, 
  question_type, 
  question_text, 
  answers, 
  correct_answer, 
  points, 
  order_index,
  image_url
) VALUES (
  v_quiz_content_id, 
  'suf-8', 
  'suffixes', 
  'multiplechoice', 
  'The suffix "-megaly" means:', 
  '{"A": "Pain", "B": "Inflammation", "C": "Disease", "D": "Enlargement"}', 
  'D', 
  1, 
  0,
  null
);
```

**JSON File (`/public/data/quiz-hints/XX-suffixes.json`):**
```json
{
  "suf-8": {
    "question_type": "multiplechoice",
    "question_text": "The suffix \"-megaly\" means:",
    "answers": {
      "A": "Pain",
      "B": "Inflammation",
      "C": "Disease",
      "D": "Enlargement"
    },
    "correct_answer": "D",
    "hint": "Think MEGA - like mega-size, mega-big!",
    "explanation": "**-megaly** means **enlargement** or **abnormally large** 📏\n\n💡 **Remember it:** -MEGALY starts with MEGA - like MEGA-SIZE at McDonald's, or MEGA-blocks - it means BIG! Cardiomegaly = enlarged heart. Hepatomegaly = enlarged liver. Splenomegaly = enlarged spleen. Whenever you see -MEGALY, something grew too BIG, like it got MEGA-SIZED!"
  }
}
```

**TRUE/FALSE EXAMPLE:**

**Database:**
```sql
INSERT INTO quiz_questions (
  content_item_id, question_id, section_key, question_type, 
  question_text, answers, correct_answer, points, order_index, image_url
) VALUES (
  v_quiz_content_id, 'suf-17', 'suffixes', 'truefalse', 
  'The suffix "-lysis" means hardening.', 
  '{"A": "True", "B": "False"}', 'B', 1, 1, null
);
```

**JSON File:**
```json
{
  "suf-17": {
    "question_type": "truefalse",
    "question_text": "The suffix \"-lysis\" means hardening.",
    "answers": {
      "A": "True",
      "B": "False"
    },
    "correct_answer": "B",
    "hint": "Think of Listerine dissolving plaque - breaking things DOWN!",
    "explanation": "**FALSE!** ❌ **-lysis** means **breakdown** or **destruction**, NOT hardening!\n\n💡 **Remember it:** -LYSIS sounds like 'LIES-IS' (falling apart)! Think of things DISSOLVING, BREAKING DOWN, LOOSENING! Hemolysis = breakdown of red blood cells. Dialysis = breaking down/filtering waste from blood. Paralysis = breakdown of muscle function. The opposite of hardening - it's about things FALLING APART or being DESTROYED!"
  }
}
```

**EXAMPLE WITH IMAGE:**

**Database:**
```sql
INSERT INTO quiz_questions (
  content_item_id, question_id, section_key, question_type, 
  question_text, answers, correct_answer, points, order_index, image_url
) VALUES (
  v_quiz_content_id, 'neuro-brain-anatomy-1', 'neuro-procedures-fundamentals', 'multiplechoice', 
  'What structure is indicated by the arrow in this sagittal brain MRI?', 
  '{"A": "Cerebellum", "B": "Medulla oblongata", "C": "Pons", "D": "Thalamus"}', 
  'A', 1, 0, 
  'https://cffhrzzfhyotkbuuoayc.supabase.co/storage/v1/object/public/quiz-images/brain-sagittal-cerebellum.jpg'
);
```

**JSON File:**
```json
{
  "neuro-brain-anatomy-1": {
    "question_type": "multiplechoice",
    "question_text": "What structure is indicated by the arrow in this sagittal brain MRI?",
    "answers": {
      "A": "Cerebellum",
      "B": "Medulla oblongata",
      "C": "Pons",
      "D": "Thalamus"
    },
    "correct_answer": "A",
    "hint": "Look at the posterior fossa - it's the largest structure there!",
    "explanation": "**Cerebellum** - the little brain! 🧠\n\n💡 **Remember it:** CEREBELLUM = 'little brain' in Latin. It sits in the posterior fossa (back of skull) below the occipital lobes. It's responsible for coordination, balance, and fine motor control. On sagittal MRI, it has a characteristic 'tree-like' appearance called the arbor vitae (tree of life)!"
  }
}
```

**STYLE GUIDELINES:**
- **Hints**: Short, memorable, relatable (use everyday comparisons, wordplay, mnemonics)
- **Explanations**: 
  - Start with bold definition and emoji
  - Add "💡 **Remember it:**" section with creative memory aids
  - Use real-world examples (McDonald's, brands, everyday objects)
  - Include clinical examples when relevant
  - Use formatting: **bold**, CAPS for emphasis
  - Make it FUN and MEMORABLE - like teaching a friend!
- **Images**: 
  - Set `image_url` to `null` if no image needed (most questions)
  - Use Supabase Storage URLs when images are provided
  - Common use cases: anatomical diagrams, MRI scans, positioning photos, equipment images
  - Images will display above the question text in the quiz interface

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
  v_video_content_id UUID;
  v_quiz_content_id UUID;
BEGIN
  -- Get section ID
  SELECT id INTO v_section_id FROM sections WHERE slug = '[section-slug]';
  
  -- Insert module (or UPDATE if it already exists)
  INSERT INTO modules (section_id, slug, title, description, icon, order_index, is_published, is_locked)
  VALUES (v_section_id, '[module-slug]', '[Module Name]', '[Description]', '[Emoji]', [order_index], true, false)
  RETURNING id INTO v_module_id;
  
  -- OR if updating an existing module:
  -- UPDATE modules
  -- SET
  --   title = '[Module Name]',
  --   description = '[Description]',
  --   icon = '[Emoji]',
  --   is_published = true,
  --   is_locked = false,
  --   updated_at = NOW()
  -- WHERE section_id = v_section_id AND slug = '[module-slug]'
  -- RETURNING id INTO v_module_id;
  
  -- Insert video content (if exists)
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'introduction', '[Video Title]', '[Description]', 'video', '🎥', 1, '{"videoUrl": "[URL]"}', true)
  RETURNING id INTO v_video_content_id;
  
  -- Insert quiz content (if exists)
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, '[quiz-slug]', '[Quiz Title]', '[Description]', 'quiz', '📝', 2, '{}', true)
  RETURNING id INTO v_quiz_content_id;
  
  -- Insert or update quiz_sections (IMPORTANT: Do this BEFORE inserting questions!)
  INSERT INTO quiz_sections (key, title, description, icon, order_index)
  VALUES ('[quiz-slug]', '[Quiz Section Title]', '[Description]', '📝', 0)
  ON CONFLICT (key) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    order_index = EXCLUDED.order_index,
    updated_at = NOW();
  
  -- Insert quiz questions (question data ONLY - no hints/explanations in DB!)
  INSERT INTO quiz_questions (
    content_item_id, 
    question_id, 
    section_key, 
    question_type, 
    question_text, 
    answers, 
    correct_answer, 
    points, 
    order_index,
    image_url
  ) VALUES 
    (v_quiz_content_id, 'question-1', '[quiz-slug]', 'multiplechoice', 'What is...?', '{"A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D"}', 'A', 1, 0, null),
    (v_quiz_content_id, 'question-2', '[quiz-slug]', 'truefalse', 'The term means hardening.', '{"A": "True", "B": "False"}', 'B', 1, 1, null),
    (v_quiz_content_id, 'question-3', '[quiz-slug]', 'multiplechoice', 'What structure is indicated by the arrow?', '{"A": "Cerebellum", "B": "Medulla", "C": "Pons", "D": "Thalamus"}', 'A', 1, 2, 'https://xyz.supabase.co/storage/v1/object/public/quiz-images/brain-sagittal.jpg')
    -- ... more questions (include image_url only if image is provided, otherwise null)
  ;
  
  -- Insert document (if exists)
  INSERT INTO content_items (module_id, slug, title, description, type, icon, order_index, metadata, is_published)
  VALUES (v_module_id, 'reading', '[Doc Title]', '[Description]', 'document', '📄', 3, '{"documentUrl": "[URL]"}', true);
  
END $$;
```

**CRITICAL REMINDERS:**
- Always escape single quotes in text fields: `It''s` not `It's`
- Insert quiz_sections BEFORE quiz_questions (foreign key constraint!)
- Use proper JSON format for answers: `'{"A": "text", "B": "text"}'`
- Variable names must use underscores not hyphens: `v_quiz_content_id` not `v_quiz-content-id`
- Include `image_url` column in INSERT statements (set to `null` if no image)
- **ALWAYS set `is_locked = false`** when publishing a module (or it will show as locked in sidebar!)
- **DO NOT include `hint` or `explanation` columns in INSERT statements** - those go in JSON files only!

### Step 6: Create JSON Hint File
1. Determine the numbered filename (e.g., `11-[quiz-slug].json` for the 11th quiz)
2. Create file at `/public/data/quiz-hints/XX-[quiz-slug].json`
3. Structure: `{ "question-id": { ...question data with hint & explanation... } }`
4. Include ALL question context (question_text, answers, correct_answer) for easy editing
5. Write fun, memorable hints and explanations following the style guide above

### Step 7: Execute Migration
1. Save the SQL migration file
2. Ask user to confirm before running
3. Run the migration: Connect to Supabase and execute SQL
4. Verify: Query to confirm module, content_items, quiz_sections, and quiz_questions were created

### Step 8: Verify Everything Works
1. Check that module appears in sidebar
2. Verify video page loads (if exists)
3. Verify quiz page loads with questions FROM DATABASE (if exists)
4. Check server logs to confirm questions are loading from DB
5. Check that hints/explanations are loading from JSON file
6. Verify document page loads (if exists)
7. Test navigation between content items
8. Confirm progress tracking works in admin dashboard

### Step 9: Report Back
Provide summary:
- ✅ Module created: [name]
- ✅ Position: [section] at order_index [X]
- ✅ Content items: [list with types]
- ✅ Quiz questions: [count] stored in database
- ✅ Hints/Explanations: JSON file created at `/public/data/quiz-hints/XX-[quiz-slug].json`
- ✅ Migration file: [filename]
- ✅ Database verified: quiz_sections + quiz_questions populated
- ✅ All verified and working!

---

**IMPORTANT REMINDERS FOR AI:**
- Always use UUIDs properly with gen_random_uuid()
- Always check existing order_index values before assigning
- Parse quiz questions intelligently - handle messy formatting
- Generate meaningful slugs (lowercase-kebab-case)
- Create proper metadata JSON for videos/documents
- **QUIZ ARCHITECTURE**: Question data goes in database, hints/explanations go in JSON files at `/public/data/quiz-hints/`
- Include hints and explanations for EVERY quiz question in the fun, memorable style shown above
- Create numbered JSON hint files (01-slug.json, 02-slug.json, etc.) in correct order
- Include full question context in JSON files for easy editing by admins
- Verify quiz questions load from database (check server logs)
- Verify hints/explanations load from JSON files
- Test everything before confirming completion
- If anything is unclear, ASK the user before proceeding

