# LEARNING_ENGINE_PLAN.md
## Lean-Garo — Learning Engine Design
**Author:** Claude B (Platform Side)
**Date:** 2026-06-03

---

## 1. OVERVIEW

A learning engine for Lean-Garo must serve all target user types:
- **Students** — vocabulary drills, grammar quizzes
- **Teachers** — assign categories, track class progress
- **Churches** — liturgical phrase sets
- **Tourists** — survival phrase flashcards
- **Researchers** — full dictionary access
- **Business users** — domain-specific vocabulary

---

## 2. CATEGORY LEARNING

### Design
Each category (food, family, nature, etc.) becomes a learning module.

```
CategoryModule {
  id: string           // e.g. "food"
  label: string        // "Food & Cooking"
  emoji: string        // "🍚"
  entries: Entry[]     // from getCategoryVocabulary(id)
  difficulty: 1|2|3    // set by content team
}
```

### Flow
1. User selects category
2. System loads entries for that category
3. User progresses through: Learn → Practice → Quiz → Mastered

### Platform Files Needed
- `src/pages/Learn.jsx` — category selection screen
- `src/components/CategoryCard.jsx` — card UI per category
- `src/hooks/useLearning.js` — progress state hook

---

## 3. FLASHCARDS

### Design
Each flashcard shows one word pair. User flips to reveal translation.

```
Flashcard {
  front: string        // English word
  back: string         // Garo word
  category: string
  status: 'new' | 'learning' | 'mastered'
  nextReview: Date     // spaced repetition
}
```

### Spaced Repetition (SRS)
Simple SRS using 3 buckets:
- **New** — shown daily
- **Learning** — shown every 3 days
- **Mastered** — shown every 7 days

User rates each card: ❌ Again | 😐 Hard | ✅ Easy

### Platform Files Needed
- `src/components/Flashcard.jsx` — flip card UI
- `src/components/FlashcardDeck.jsx` — deck manager
- `src/hooks/useSRS.js` — spaced repetition logic

### Storage
Use `localStorage` for session persistence. No backend required for MVP.

---

## 4. QUIZZES

### Quiz Types

**Type A — Multiple Choice (English → Garo)**
- Show English word
- 4 options: 1 correct Garo + 3 random Garo words from same category
- 10 questions per round

**Type B — Multiple Choice (Garo → English)**
- Reverse of Type A

**Type C — Fill in the Blank**
- Show sentence with one word missing
- User types the Garo word

**Type D — Listening (future)**
- Audio of Garo word, user selects English meaning
- Requires audio assets (not in scope for MVP)

### Scoring
```
Score {
  correct: number
  incorrect: number
  percentage: number
  timeSpent: number (seconds)
  category: string
  date: Date
}
```

### Platform Files Needed
- `src/pages/Quiz.jsx` — quiz runner
- `src/components/QuizQuestion.jsx` — individual question
- `src/components/QuizResult.jsx` — results screen
- `src/hooks/useQuiz.js` — quiz state machine

---

## 5. PROGRESS TRACKING

### What to Track
```
UserProgress {
  wordsLearned: number
  wordsMastered: number
  quizzesTaken: number
  averageScore: number
  streakDays: number
  categoryProgress: {
    [categoryId]: {
      total: number
      mastered: number
      lastStudied: Date
    }
  }
}
```

### Storage Strategy
- MVP: `localStorage` — no login required, works offline
- Future: Supabase or Firebase for cross-device sync (architecture decision for Gemini)

### Progress UI
- `src/pages/Progress.jsx` — dashboard with charts
- `src/components/ProgressBar.jsx` — per-category progress
- `src/components/Streak.jsx` — daily streak counter

---

## 6. IMPLEMENTATION PHASES

| Phase | Feature | Effort | Dependency |
|---|---|---|---|
| MVP | Flashcards (basic flip) | Low | Category data in dictionary |
| MVP | Multiple choice quiz | Low | Category data in dictionary |
| MVP | localStorage progress | Low | None |
| V2 | Spaced repetition | Medium | localStorage progress |
| V2 | Progress dashboard | Medium | Progress tracking |
| V2 | Fill-in-the-blank | Medium | Sentence data |
| V3 | Teacher dashboard | High | Auth system (Gemini decision) |
| V3 | Class management | High | Backend (Gemini decision) |
| V3 | Audio flashcards | High | Audio assets (language team) |

---

## 7. ROUTING ADDITIONS NEEDED

```jsx
// Add to App.jsx routes
<Route path="/learn" element={<Learn />} />
<Route path="/learn/:category" element={<FlashcardDeck />} />
<Route path="/quiz" element={<Quiz />} />
<Route path="/quiz/:category" element={<Quiz />} />
<Route path="/progress" element={<Progress />} />
```

**Note:** Routing additions require Gemini approval before implementation.

---

## 8. BLOCKER

**All learning features depend on category data in `master_dictionary.json`.**
Without `category` fields populated on dictionary entries, flashcard decks and category quizzes cannot be generated. This is a language/content team responsibility, not platform.

