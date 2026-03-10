# 🕵️‍♂️ Next Component Analyzer

[![NPM version](https://img.shields.io/npm/v/next-component-analyzer.svg?style=flat)](https://www.npmjs.com/package/next-component-analyzer) [![NPM downloads](https://img.shields.io/npm/dm/next-component-analyzer.svg?style=flat)](https://npmjs.org/package/next-component-analyzer)

**Stop guessing if your Next.js components should be Server or Client — let the analyzer do the work.**  

Ever added `"use client"` somewhere just because “it might need state” and then wondered a week later, *“Wait… does this even need to be a client component?”* Yeah… we’ve all been there.  

Enter **Next Component Analyzer**: your CLI sidekick for:

- Scanning your entire Next.js repo 🔍  
- Detecting React hooks, browser APIs, and JSX event handlers 🪝  
- Suggesting whether a component should be **Server** or **Client**  
- Highlighting **unnecessary `"use client"` directives** 💥  

---

## 🚀 Features

- **AST-based analysis** — no more false positives from naive string matching  
- **Component detection** — ignores utils, helpers, configs, and other boring stuff  
- **Classification** into four meaningful categories:

| Category | What it means |
|----------|----------------|
| Client Component (correct) | Has client features **and** `"use client"` |
| Suggested: Client Component | Has client features but **missing** `"use client"` |
| Suggested: Server Component | No client features, **no `"use client"`** |
| Could be Server Component (unnecessary client) | `"use client"` is present, but no client features |

- Detects: React hooks, Next navigation hooks, browser APIs, JSX events  

---

## ⚡ Installation

```bash
# Run without installing
npx next-component-analyzer

# Or install globally
npm install -g next-component-analyzer
next-component-analyzer

```
---

## 🧑‍💻 Author

Built with mild obsession and an unreasonable number of AST nodes by **[cinfinit](https://github.com/cinfinit)**.

I like building developer tools that solve the tiny annoyances we all pretend don't exist — like staring at a Next.js component wondering *“Does this actually need `"use client"`?”*

If this tool saved you from one unnecessary client component, my work here is done.

If it saved you from **ten**, we can both agree "use client" was getting a little out of hand..

* GitHub: https://github.com/cinfinit
* Twitter/X: https://x.com/cinfinitedev 

---

*P.S. If the analyzer roasts your component architecture… that's between you and your React hooks.*
