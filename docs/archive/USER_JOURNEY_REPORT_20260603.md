# USER_JOURNEY_REPORT.md
## Lean-Garo — User Experience Review
**Auditor:** Claude B (Platform Side)
**Date:** 2026-06-03

---

## EVALUATION METHOD
Each user type was evaluated by simulating their likely first interaction with the platform at `https://lean-garo.onrender.com`.

---

## 1. STUDENT

**Goal:** Learn Garo vocabulary, practice phrases, take a quiz.

### Journey
1. Opens site → Translator tab loads ✅
2. Types "hello" → Gets translation ✅
3. Clicks Dictionary tab → Page loads ✅
4. Types "food" in search → **❌ Nothing appears (missing searchVocabulary)**
5. Tries category dropdown → **❌ Empty (missing getAllCategories)**
6. Clicks Phrases tab → Sees phrase sets ✅
7. Looks for quiz or flashcard feature → **❌ Does not exist**
8. Refreshes `/dictionary` URL → **❌ 404 on Render (SPA routing bug)**

**Score: 3/8 steps work**
**Blockers:** Search broken, no learning features, sub-route refresh fails.

---

## 2. TEACHER

**Goal:** Find vocabulary by category to prepare a lesson, share with students.

### Journey
1. Opens site → Translator tab ✅
2. Navigates to Dictionary ✅
3. Tries to filter by category (e.g. "family") → **❌ Category dropdown empty**
4. Tries to search "mother" → **❌ No results (broken search)**
5. Looks for lesson plan export or print view → **❌ Does not exist**
6. Looks for student progress tracking → **❌ Does not exist**
7. Checks Grammar tab for reference material → ✅ Content available

**Score: 3/7 steps work**
**Blockers:** Category browsing broken, no teacher tools, no export.

---

## 3. TOURIST

**Goal:** Find survival phrases for travel in Meghalaya — greetings, directions, food.

### Journey
1. Opens site → Translator tab ✅
2. Types "where is the market" → Gets partial translation ✅
3. Types "how much" → Gets result ✅
4. Clicks Phrases tab → Finds phrase categories ✅
5. Finds "Market & Shopping" phrases → ✅
6. Looks for pronunciation guide → **❌ No audio, no phonetics guide**
7. Tries to save or bookmark phrases → **❌ No favourites feature**
8. Uses on mobile (narrow screen) → ✅ Responsive layout works

**Score: 5/8 steps work**
**Blockers:** No audio, no offline capability, no favourites. Tourist UX is the best of all user types.

---

## 4. BUSINESS USER

**Goal:** Find domain-specific vocabulary (office, government, finance), translate documents.

### Journey
1. Opens site → Translator tab ✅
2. Types "agreement" → Gets result (if in dictionary) ⚠️ Depends on dictionary coverage
3. Types multi-sentence paragraph → Gets word-by-word output ⚠️ Not sentence-aware
4. Looks for business/legal/finance category → **❌ Category browse broken**
5. Searches "government" → **❌ Search broken**
6. Looks for bulk translation or document upload → **❌ Does not exist**
7. Looks for API access → **❌ No public API**

**Score: 1-2/7 steps work**
**Blockers:** Search broken, no domain vocabulary browsing, no bulk/document translation.

---

## 5. CHURCH USER

**Goal:** Find liturgical phrases, hymn vocabulary, religious terms for worship services.

### Journey
1. Opens site → Translator tab ✅
2. Types "God" → Gets result ✅ (if in dictionary)
3. Types "prayer" → Gets result ⚠️
4. Looks for religious phrase set in Phrases tab → **❌ No dedicated religious phrases**
5. Searches dictionary for "church" category → **❌ Search broken**
6. Looks for hymn translation support → **❌ Does not exist**
7. Checks Grammar tab for verb conjugation (for liturgical texts) → ✅

**Score: 3/7 steps work**
**Blockers:** No religious phrase set, search broken, no hymn/liturgy tools.

---

## SUMMARY TABLE

| User Type | Steps Working | Critical Blockers |
|---|---|---|
| Student | 3/8 | No search, no learning features |
| Teacher | 3/7 | No category browse, no teacher tools |
| Tourist | 5/8 | Best experience, lacks audio/offline |
| Business | 1-2/7 | Worst experience, search broken |
| Church | 3/7 | No religious phrases, search broken |

---

## COMMON BLOCKERS ACROSS ALL USERS

1. **Search broken** — affects every user type
2. **Category browse broken** — affects every user type
3. **Sub-route 404 on refresh** — affects navigation
4. **No learning features** — affects students, teachers, church users
5. **No audio/pronunciation** — affects tourists, students

---

## QUICK WINS (Platform Side, no architecture change)

| Fix | Users Helped | Effort |
|---|---|---|
| Restore search methods | All | Low |
| Fix vite base path + `_redirects` | All | Low |
| Add religious phrase set to Phrases.jsx | Church, Tourist | Low |
| Add null guard in Dictionary.jsx category sort | All | Low |
| Add "No results" message improvement | All | Low |
| Add result count display | All | Low |

