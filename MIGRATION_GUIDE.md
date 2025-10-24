# Migration Guide: Hierarchical Content Structure

## Overview
This migration transforms the TeslaMR platform from a quiz-centric to a modular, hierarchical content structure.

## New Structure

```
Section (e.g., Phase 1, Phase 2)
  └─ Module (e.g., Medical Terminology)
      └─ Content Item (e.g., Prefixes Quiz, Intro Video)
```

## URL Structure

### Old URLs
- `/quiz/prefixes`
- `/quiz/suffixes`

### New URLs
- `/phase1` - Section overview
- `/phase1/medical-terminology` - Module overview
- `/phase1/medical-terminology/quiz/prefixes` - Quiz page
- `/phase1/medical-terminology/quiz/suffixes` - Quiz page

## Database Changes

### New Tables
1. **`sections`** - Top-level organizational units
   - id, slug, title, description, icon, order_index, is_published

2. **`modules`** - Content modules within sections
   - id, section_id, slug, title, description, icon, order_index, is_published

3. **`content_items`** - Individual content pieces (quizzes, videos, readings)
   - id, module_id, slug, title, description, type, icon, order_index, metadata, is_published

4. **`user_section_progress`** - Tracks progress at section level
   - user_id, section_id, total_modules, completed_modules, progress_percent

5. **`user_module_progress`** - Tracks progress at module level
   - user_id, module_id, total_items, completed_items, progress_percent

6. **`user_content_progress`** - Tracks progress for individual content
   - user_id, content_item_id, completed, score, attempts, time_spent_seconds

### Modified Tables
- **`quiz_questions`** - Added `content_item_id` column (keeps `section_key` for backward compatibility)

## Initial Data Seeded

### Sections
1. Onboarding (not published yet)
2. **Phase 1** (published) ✅
3. Phase 2 (not published yet)
4. Clinical Site Readiness (not published yet)
5. Registry Prep (not published yet)

### Modules (under Phase 1)
- **Medical Terminology** ✅

### Content Items (under Medical Terminology)
1. Prefixes - Quiz
2. Suffixes - Quiz
3. Root Words - Quiz
4. Abbreviations - Quiz
5. Patient Positioning - Quiz

## Migration Steps

### 1. Run the Database Migration
Execute the SQL file in Supabase SQL Editor:
```bash
supabase/migrations/007_hierarchical_content_structure.sql
```

This will:
- Create all new tables
- Seed initial sections, modules, and content items
- Link existing quiz questions to content items
- Migrate existing progress data
- Set up RLS policies
- Create automatic progress update triggers

### 2. Update Seed Script (if needed)
The `scripts/seed-quiz-data.ts` script may need updates to work with the new structure if you need to re-seed quiz questions.

### 3. Deploy New Routes
The following new routes are now available:
- `app/[section]/page.tsx` - Section overview
- `app/[section]/[module]/page.tsx` - Module overview
- `app/[section]/[module]/quiz/[slug]/page.tsx` - Quiz page

### 4. Old Routes
The old `/quiz/[section]` routes are still present but should be considered deprecated. Users should be redirected to the new structure.

## Component Updates

### New Components
- **`ModuleSidebar.tsx`** - Server component that fetches hierarchical data
- **`ModuleSidebarClient.tsx`** - Client component for sidebar UI with collapsible sections/modules

### Updated Components
- **`app/dashboard/page.tsx`** - Now uses ModuleSidebar and displays sections
- **`QuizInterface.tsx`** - Still works, but now receives content_item_id instead of section_key

## Progress Tracking

### How It Works
1. User completes a quiz question → updates `user_quiz_progress`
2. Trigger calculates completion for that content item → updates `user_content_progress`
3. Trigger rolls up content progress → updates `user_module_progress`
4. Trigger rolls up module progress → updates `user_section_progress`

### Progress Calculation
- **Content Item**: Completed when SM-2 criteria met (ease_factor >= 2.5, interval >= 21)
- **Module**: `progress_percent` = average of all content item progress
- **Section**: `progress_percent` = average of all module progress

## Testing Checklist

- [ ] Run database migration successfully
- [ ] Verify all 5 sections appear in sidebar
- [ ] Verify Phase 1 can be expanded/collapsed
- [ ] Verify Medical Terminology module appears under Phase 1
- [ ] Verify 5 quizzes appear under Medical Terminology
- [ ] Test navigating to `/phase1` - should show section overview
- [ ] Test navigating to `/phase1/medical-terminology` - should show module overview
- [ ] Test navigating to `/phase1/medical-terminology/quiz/prefixes` - should load quiz
- [ ] Test completing a quiz and verify progress updates at all levels
- [ ] Verify dashboard shows correct stats
- [ ] Verify admin pages still work (may need updates)

## Backward Compatibility

### What's Preserved
- Existing quiz questions and their IDs
- User quiz progress data
- SM-2 spaced repetition data
- Old `section_key` field in `quiz_questions`

### What's Deprecated
- `/quiz/[section]` URLs (still work but should redirect)
- `QuizSidebar` component (replaced by `ModuleSidebar`)
- Old `user_section_progress` table structure (new one uses section_id instead of section_key)

## Future Enhancements

### Content Types to Add
- Videos (`type: 'video'`)
- Readings (`type: 'reading'`)
- Assessments (`type: 'assessment'`)
- Interactive simulations

### Routes to Create
- `/[section]/[module]/video/[slug]`
- `/[section]/[module]/reading/[slug]`
- `/[section]/[module]/assessment/[slug]`

## Troubleshooting

### Migration Fails
- Check Supabase logs for specific errors
- Ensure you have the latest schema
- Verify `quiz_sections` and `quiz_questions` tables exist

### Progress Not Updating
- Check that triggers are active: `trg_update_module_progress`, `trg_update_section_progress`
- Verify `content_item_id` is set on quiz questions
- Check user permissions (RLS policies)

### Old URLs Not Working
- Old `/quiz/[section]` routes should still work
- Consider adding redirects in middleware

## Support
For questions or issues, contact the development team or open an issue in the repo.

