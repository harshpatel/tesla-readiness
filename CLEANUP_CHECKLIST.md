# Cleanup Checklist - Post Migration

## Files to Delete (Old Structure)
- [ ] `app/quiz/[section]/page.tsx` - Old quiz route (replaced by `/[section]/[module]/quiz/[slug]`)
- [ ] `components/QuizSidebar.tsx` - Old sidebar component (replaced by `ModuleSidebar`)

## Files to Update

### 1. middleware.ts
**Current**: Protects `/quiz/:path*`  
**Update to**: Protect `/phase1/:path*`, `/phase2/:path*`, `/clinical/:path*`, `/registry/:path*` (or just `/:section/:path*`)

```typescript
// OLD
matcher: ['/dashboard/:path*', '/quiz/:path*', '/results/:path*', '/admin/:path*', '/masteradmin/:path*', '/login'],

// NEW (suggested)
matcher: ['/dashboard/:path*', '/phase1/:path*', '/phase2/:path*', '/onboarding/:path*', '/clinical/:path*', '/registry/:path*', '/results/:path*', '/admin/:path*', '/masteradmin/:path*', '/login'],
```

Or more elegantly, just protect any route that's not public:
```typescript
// Protect all routes except public ones
if (pathname === '/' || pathname === '/login' || pathname.startsWith('/api/')) {
  return NextResponse.next();
}
// All other routes require auth
```

## Optional Renames (For Clarity)

### Component Naming
Current structure is good, but consider these semantic improvements:

#### QuizInterface.tsx
- Component name is fine, but props could be more semantic:
  - `sectionKey` → `contentItemId` (since it now receives content_item_id)
  - `sectionTitle` → `quizTitle`
  - `sectionIcon` → `quizIcon`

These are minor and optional - current names still make sense.

## Documentation Updates
- [ ] Update `QUIZ_SYSTEM.md` to reflect new structure
- [ ] Update `AUTH_SETUP.md` route examples
- [ ] Keep `MIGRATION_GUIDE.md` for reference

## Database Cleanup (Optional - Later)
After confirming everything works, you can eventually drop old tables:
- `DROP TABLE public.user_quiz_progress;` (keep for now as backup)
- Old `quiz_sections` table (if it exists and unused)

## Code References That Are Fine
These references to "quiz" are appropriate and don't need changing:
- `components/QuizInterface.tsx` - Correct (it's literally the quiz interface)
- `app/api/quiz/progress/route.ts` - API route, path is fine
- Variable names like `quizData`, `quiz_questions` - All appropriate

## Summary
**Must Do:**
1. Delete old `app/quiz/[section]/page.tsx`
2. Delete old `components/QuizSidebar.tsx`
3. Update `middleware.ts` route matcher

**Nice to Have:**
- Semantic prop renames in QuizInterface
- Documentation updates

**Leave As Is:**
- `quiz_questions` table name
- `QuizInterface` component name
- API routes with `/api/quiz/`
- Any variable/function names with "quiz"

