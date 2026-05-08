# ApexLearn 🚀

**The best free platform to learn Salesforce Apex.**

Interactive, gamified, no login required. From variables to callouts.

## Live Features

- 🎓 **10 Modules** covering the full Apex roadmap
- ✏️ **Real code editor** with line numbers, tab support, and auto-indent
- 🖥️ **Debug console** — simulates `System.debug()` output
- ✅ **Exercise validation** — checks your output against expected results
- 🔥 **Streaks** — daily learning streaks tracked in localStorage
- ⭐ **XP & Levels** — 10 levels from Trailblazer to Apex Champion
- 🏅 **Badges** — 10 achievements to unlock
- 📢 **Ad placeholders** — ready for Google AdSense integration
- 📱 Responsive design

## Curriculum

1. **Apex Foundations** — What is Apex, Variables, Operators
2. **Control Flow** — If/Else, Switch, For loops, While loops
3. **Collections** — Lists, Sets, Maps
4. **OOP** — Classes, Objects, Inheritance, Interfaces
5. **SOQL & DML** — Querying and manipulating Salesforce data
6. **Apex Triggers** — Before/After triggers, context variables
7. **Governor Limits** — Understanding and respecting limits
8. **Asynchronous Apex** — Future methods, Batch Apex
9. **Apex Testing** — Test classes, assertions, code coverage
10. **Exception Handling** — Try/catch/finally, custom exceptions
11. **HTTP Callouts** — REST APIs, JSON, callout mocks

## Tech Stack

- **React 18** + **Vite 5**
- No UI framework — pure custom CSS with CSS variables
- Google Fonts: Syne, DM Sans, JetBrains Mono
- LocalStorage for persistence (no backend, no login)

## Deploy to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
npm install
vercel --prod
```

### Option 2: GitHub → Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Framework Preset: **Vite**
5. Click Deploy — done!

## Local Development

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

## Adding Google AdSense

Replace the ad placeholder divs in:
- `src/App.jsx` → `header-ad` div (728×90 leaderboard)
- `src/App.jsx` → `sidebar-bottom-ad` div (160×200 sidebar)

With:
```html
<ins class="adsbygoogle"
  style="display:inline-block;width:728px;height:90px"
  data-ad-client="ca-pub-XXXXXXXXXX"
  data-ad-slot="XXXXXXXXXX">
</ins>
```

## Apex Runner

The built-in Apex runner (`src/utils/apexRunner.js`) translates a subset of Apex to JavaScript for in-browser execution. It supports:

- Primitive types: Integer, String, Boolean, Decimal, Double
- Collections: List, Set, Map
- Control flow: if/else, switch, for, while
- System.debug() → debug console
- String/Math methods
- Exception handling (basic)

## Roadmap

- [ ] Add more lessons per module (30+ total planned)
- [ ] SOQL query builder interactive tool
- [ ] Governor Limits live counter
- [ ] Leaderboard (optional backend)
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)
- [ ] Community forum integration

## License

MIT — free to use, modify, and deploy.

---

Built with ❤️ for the Salesforce developer community.
