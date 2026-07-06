# 🌍 A'chik Garo Language Platform

A comprehensive, production-ready semantic translation and learning platform for the A'chik Garo language of Meghalaya, India.

## 🎯 Features

### 💬 Real-Time Semantic Translation
- **Live Translation Engine**: Translates between English ↔ Garo ↔ Hindi
- **Grammar Analysis**: Automatically detects and explains grammatical structures
- **Morphology Parsing**: Identifies verb roots, tenses, and morphological patterns
- **Classifier Detection**: Understands and applies appropriate noun classifiers
- **Fuzzy Matching**: Handles typos and variations in input
- **Semantic Understanding**: Not just literal word replacement, but contextual understanding

### 📚 Comprehensive Dictionary
- **6000+ vocabulary entries** organized by semantic categories
- **Instant search** with category filtering
- **Multi-language search** (English, Garo, Hindi)
- **Classifier mappings** for all noun types
- **Usage examples** for every entry

### 💡 Learning Resources
- **Daily Phrases**: Common expressions for social, market, travel, and cultural contexts
- **Verb & Grammar Reference**: Complete guide to Garo grammar system
- **Classifier System**: Learn when and how to use different noun classifiers
- **Number System**: Dynamic number generation including compound numbers
- **Pronouns & Possessives**: Complete pronoun paradigm with usage examples

## 🏗️ Architecture

### Frontend (React + TailwindCSS + Vite)
- **4-Page SPA Application**:
  1. **Translator**: Real-time semantic translation with grammar breakdown
  2. **Dictionary**: Searchable vocabulary database with filters
  3. **Phrases**: Curated collection of practical phrases
  4. **Grammar & Verbs**: Educational reference for language structure

### Backend (Express.js)
- Static file serving
- API endpoints for extensibility
- Production-ready deployment configuration

### Translation Engine
- Semantic understanding rather than word-for-word translation
- Morphology-aware verb conjugation
- Classifier-intelligent counting system
- Fuzzy normalization and error tolerance
- Translation priority system (exact > compound > classified > normalized > morphology-aware > grammar-aware > semantic > fuzzy)

## 📚 Documentation

| Doc | Purpose |
|---|---|
| `docs/ARCHITECTURE.md` | Complete engineering reference — pipeline stages, dictionary resolution priority, suffix generation logic, worked examples, module map, repo audit, future roadmap |
| `docs/THANGSENG_RULES_LOOKUP.md` | Full native-speaker-confirmed grammar rule catalogue (33 rules), with examples and confirmation dates |
| `docs/GRAMMAR_SPEC.md` | At-a-glance rule status index (confidence level, implementation location, test coverage) |
| `docs/PENDING_reverse_translation.md` | Status of Garo→English reverse translation (currently blocked, no reverse dictionary source) |

## 🧪 Testing

```bash
npm test          # Unit + regression suite (tests/unit/translationEngine.test.js)
npm run build     # Full pipeline: dictionary validation → regression suite → production bundle
```

The regression suite (49+ cases and growing) covers every confirmed grammar rule and is wired into `npm run build` — a grammar or dictionary regression fails the build automatically. CI (`.github/workflows/ci.yml`) runs this on every push/PR to `main`.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Opens at http://localhost:5173
```

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start

# Runs on http://localhost:3001
```

## 📋 Project Structure

```
Learn-garo/
├── src/
│   ├── App.jsx                    # Main app with routing
│   ├── main.jsx                   # React entry point
│   ├── index.css                  # TailwindCSS styles
│   ├── translationEngine.js       # Semantic translation engine
│   └── pages/
│       ├── Translator.jsx         # Real-time translation
│       ├── Dictionary.jsx         # Vocabulary search
│       ├── Phrases.jsx           # Phrase collections
│       └── VerbsGrammar.jsx      # Grammar reference
├── garo_dictionary.json           # Master vocabulary database
├── server.js                      # Express server
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # TailwindCSS configuration
└── package.json                   # Dependencies
```

## 🔧 Semantic Translation Engine

The translation engine is not a simple dictionary lookup. It includes:

### Morphology Engine
- Detects verb roots and tenses
- Separates prefixes and suffixes
- Reconstructs words from morphological components

### Classifier System
- Maps nouns to semantic categories (animals, people, objects, etc.)
- Automatically applies appropriate classifiers for counting
- Validates classifier-number agreement

### Grammar Analyzer
- SOV (Subject-Object-Verb) word order detection
- Tense reconstruction from verb morphology
- Sentence structure analysis

### Fuzzy Matching
- Handles typos: "handwash" → "hand wash"
- Spacing normalization
- Phonetic matching for variant spellings
- Semantic matching as last resort

### `lets` / `let's` Phrase Handling
- Normalizes `let's` and `lets` to the same matching form (both a case-preserving
  contraction expander and an apostrophe-stripped shadow index handle this)
- Supports Hai expression translations for collective commands
- Verified translations:
  - `lets go` → `Hai re·naha`
  - `lets eat` → `Hai cha·na`
  - `lets eat food` → `Hai mi cha·na`
  - Hortative alternate: `-bo` also works (`Hai cha·bo` = let us eat), not just `-na`

## 📚 Garo Language Structure

### Classifiers (Noun Counters)

| Classifier | Use For | Examples |
|-----------|---------|----------|
| **Mang** | Animals, birds, fish, insects | achak sa·mang (one dog) |
| **Sak** | People, persons | manderang gni·sak (two people) |
| **Gong** | Money, coins, currency | tangka bonga·gong (five rupees) |
| **King** | Books, paper, leaves, flat objects | ki·tap gni·king (two books) |
| **Ge** | Objects, things, items, tools | chokki sa·ge (one chair) |

### Verb Tenses & Aspect

| Tense/Aspect | Suffix | Example | English |
|-------|--------|---------|---------|
| Present | -a | cha·a | eats/eating (habitual) |
| Progressive | -enga | cha·enga | is eating |
| Past/Perfect | -aha | cha·aha | ate / has eaten |
| Future | -gen | cha·gen | will eat |
| Present negative | -ja | cha·ja | does not eat (also covers past-referring negation — Garo has no dedicated simple-past-negative suffix) |
| Future negative | -jawa | cha·jawa | will not eat |
| Discontinued | -jaha | cha·jaha | stopped eating / no longer eating |
| Completed | -manaha | cha·manaha | has finished eating (overlaps with -aha in spoken use) |
| "Used to" | -chim (full-root) | cha·achim | used to eat |
| Past progressive | [progressive] chim | cha·enga chim | was eating |

Full rule catalogue with native-speaker confirmation status: `docs/THANGSENG_RULES_LOOKUP.md`.

### Number System

Numbers 1-10: Sa, Gni, Gittam, Bri, Bonga, Dok, Sni, Chet, Sku, Chiking

Tens: Kolgrik(20), Kolatchi(30), Sotbri(40), Sotbonga(50), Sotdok(60), Sotsni(70), Sotchet(80), Sotsku(90)

Compound numbers add suffixes: Kolgrik-sa(21), Kolatchi-gni(32), Sotbri-bonga(45)

## 🌐 Deployment

**Live:** https://lean-garo.onrender.com (Render, auto-deploys from `main` on push)

### Render (current production deployment)
- Connect the GitHub repo, set build command `npm run build`, publish directory `dist`
- `public/_redirects` handles SPA client-side routing fallback

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Railway, Netlify, Replit
- All support Node.js applications
- Set `npm start` as start command
- Environment: Set NODE_ENV=production
- Port: 3001 (or PORT environment variable)

## 📖 Dictionary Structure

Each vocabulary entry includes:
- **English**: English word
- **Garo**: Garo translation with tone markers (·)
- **Hindi**: Hindi translation (Devanagari script)
- **Category**: Semantic category (animals, colors, verbs, etc.)
- **Classifier**: Appropriate noun classifier (if applicable)
- **Examples**: Usage examples with full translations

## 🎨 UI Features

- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first layout works on all devices
- **Semantic Highlighting**: Color-coded grammar analysis
- **Real-Time Updates**: Instant translation as you type
- **Copy-Paste Friendly**: Easy to copy translations
- **Accessible**: ARIA labels and keyboard navigation

## 🔍 Search Capabilities

### Fuzzy Search
- Typo tolerance
- Partial matching
- Phonetic similarity

### Filters
- By language (English, Garo, Hindi, All)
- By category (Animals, Colors, Verbs, etc.)
- By sort order (A-Z, Category)

### Advanced
- Compound word matching
- Classifier-aware search
- Root verb search

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

This platform is maintained to preserve and promote the A'chik Garo language. To contribute:

1. Vocabulary improvements
2. Grammar documentation
3. Example phrases
4. Translation engine enhancements
5. Bug reports and fixes

## 📄 License

This project serves educational and cultural preservation purposes.

## 🙏 Acknowledgments

- A'chik Garo language speakers and educators
- Meghalaya, India
- Language preservation community
- Indigenous language advocates

## 📞 Support

For issues, suggestions, or improvements, please create an issue in the repository.

---

**🌍 Preserving Indigenous Languages, Celebrating Culture, Enabling Communication**

Made with ❤️ for the A'chik Garo community.
