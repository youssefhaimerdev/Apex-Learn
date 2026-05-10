# ApexLearn v2.0 🚀

**The best free platform to master Salesforce Apex.**

> "We have only once to make the first impression."

Interactive lessons, a real code editor, boss quizzes, daily challenges, cheat sheets, streaks, XP, and badges — all in the browser, no login, no cost.

---

## ✨ What's New in v2

| Feature | Details |
|---------|---------|
| 🎓 Full Curriculum | **15 modules · 60+ lessons** — Foundations through Security |
| ⚔️ Boss Quizzes | 5-question quiz at end of each module, +XP per correct answer |
| 📅 Daily Challenges | 7 rotating coding challenges with bonus XP |
| 📋 Cheat Sheets | 5 quick-reference sheets: SOQL, Collections, Limits, Strings, Async |
| 🎪 Onboarding | 3-step welcome modal for first-time visitors |
| 🏗️ Apex Runner v2 | Improved translator — handles enums, inner classes, exceptions, JSON |
| 🔥 Streaks v2 | More robust streak tracking, 10-level system |
| 🏅 20 Badges | First Steps → Apex Champion, streak badges, module badges |
| 🔍 SEO | Full meta tags, Open Graph, Twitter Card, structured data, sitemap |
| 💡 Auto-brackets | Editor auto-closes `(`, `{`, `[`, `"`, `'` |
| 📱 Responsive | Mobile-friendly layout |

---

## 📚 Full Curriculum

1. **Apex Foundations** — What is Apex, Variables, String Methods, Math Class
2. **Control Flow** — If/Else, Switch, For Loops, While, For-Each
3. **Collections** — Lists, Sets, Maps, Sorting & Utilities
4. **Methods & Classes** — Methods, Classes, Static vs Instance
5. **OOP** — Inheritance, Abstract Classes, Interfaces
6. **SOQL** — Basics, Relationship Queries, Aggregates, Dynamic SOQL
7. **DML Operations** — Insert/Update/Delete, Database Methods, Savepoints
8. **Apex Triggers** — Basics, Trigger Handler Pattern
9. **Governor Limits** — Understanding Limits, Bulkification Patterns
10. **Async Apex** — Future Methods, Queueable, Batch Apex, Schedulable
11. **Apex Testing** — Test Classes, Test Data Factory, Callout Mocks
12. **Exception Handling** — Try/Catch/Finally, Custom Exceptions
13. **HTTP Callouts** — REST Callouts, JSON Parsing
14. **Advanced Apex** — Enums, Inner Classes, Design Patterns
15. **Apex Security** — With/Without Sharing, CRUD/FLS

---

## 🚀 Deploy to Vercel (2 minutes)

### Option A — Vercel CLI
```bash
unzip apexlearn.zip && cd apexlearn
npm install
npx vercel --prod
```

### Option B — GitHub → Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repo
4. Framework: **Vite** (auto-detected)
5. Click **Deploy** — done!

### Option C — Drag & Drop
1. Run `npm install && npm run build`
2. Drag the `dist/` folder to [vercel.com/new](https://vercel.com/new)

---

## 💻 Local Development

```bash
npm install
npm run dev
# → http://localhost:5173
```

---

## 💰 Monetization (AdSense)

Three ad placements are built in. Replace the placeholder divs:

### 1. Top Banner (728×90) — `src/App.jsx`
```jsx
// Find: <div className="top-ad">
// Replace with:
<div className="top-ad">
  <ins className="adsbygoogle"
    style={{display:'inline-block',width:'728px',height:'90px'}}
    data-ad-client="ca-pub-XXXXXXXXXX"
    data-ad-slot="XXXXXXXXXX">
  </ins>
</div>
```

### 2. Sidebar (160×250) — `src/App.jsx`
```jsx
// Find: <div className="sidebar-ad">
// Replace with AdSense ins tag
```

### 3. Home Page (between sections) — `src/App.jsx`
```jsx
// Find: <div className="ad-banner">
// Replace with AdSense ins tag
```

Don't forget to add the AdSense script to `index.html`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
```

---

## 🧠 How the Apex Runner Works

`src/utils/apexRunner.js` translates Apex syntax to JavaScript and runs it in a sandboxed `Function()`:

**Supported:**
- Primitive types: Integer, String, Boolean, Decimal, Double, Long
- Collections: List, Set, Map (with all methods)
- Control flow: if/else, switch, for, while, for-each
- Classes with constructors, instance/static methods
- Inheritance (basic: extends, override, super)
- Interfaces (implemented but ignored at runtime)
- Enums → JS objects
- Exception handling: try/catch/finally, custom throw
- String methods: all major methods
- Math methods: abs, round, floor, ceil, pow, sqrt, max, min, mod
- JSON: serialize, deserializeUntyped
- System.debug() → debug console

**Not supported (Salesforce-only):**
- SOQL queries (shown as comments/examples)
- DML operations (require a live org)
- Trigger context variables
- @future, Batch, Schedulable (syntax education only)

---

## 🗂 Project Structure

```
apexlearn/
├── index.html                  # Entry point with full SEO
├── vercel.json                 # SPA routing config
├── package.json                # React 18 + Vite 5
├── vite.config.js
├── public/
│   ├── favicon.svg
│   ├── og-image.svg            # Social sharing image
│   ├── sitemap.xml
│   └── robots.txt
└── src/
    ├── main.jsx                # React entry
    ├── App.jsx                 # Full app (900+ lines)
    ├── data/
    │   ├── curriculum.js       # Index file
    │   ├── curriculum_part1.js # Modules 1–9 (foundations→limits)
    │   └── curriculum_part2.js # Modules 10–15 + cheat sheets + badges
    ├── utils/
    │   ├── apexRunner.js       # Apex→JS translator + executor
    │   └── storage.js          # localStorage: XP, streaks, progress
    └── styles/
        └── globals.css         # Full design system (~600 lines)
```

---

## 🛠 Tech Stack

- **React 18** + **Vite 5** — fast, modern
- **Zero UI frameworks** — custom CSS with variables
- **Google Fonts** — Syne (display), DM Sans (body), JetBrains Mono (code)
- **localStorage** — all persistence, no backend, no login
- **Function()** sandbox — safe Apex code execution

---

## 📈 SEO Keywords Targeted

- learn salesforce apex
- apex programming tutorial
- free apex course
- salesforce developer training
- apex triggers tutorial
- SOQL tutorial
- salesforce certification prep
- apex collections tutorial

---

## 🗺 Roadmap

- [ ] Monaco Editor integration (full syntax highlighting)
- [ ] User accounts + leaderboard (Supabase)
- [ ] More daily challenges (30+ pool)
- [ ] Module-level progress certificate (PDF download)
- [ ] Community forum (Discourse embed)
- [ ] Apex PDFs / interview question bank
- [ ] YouTube video embeds per lesson
- [ ] Dark/Light theme toggle
- [ ] Keyboard shortcuts (Ctrl+Enter to run)
- [ ] PWA (offline support)

---

## 📄 License

MIT — free to use, modify, and deploy. Attribution appreciated but not required.

---

Built for the Salesforce developer community. Go get that certification! 🏆
