# Tic Tac Toe

A tiny, dependency-free Tic Tac Toe game built with plain HTML, CSS and JavaScript. Perfect as a test project for a first Vercel deploy.

## Features

- 2-player mode (hot seat) and vs Computer mode (unbeatable minimax AI)
- Win detection across all 8 lines, with the winning line highlighted
- Draw detection
- Score tracking for X, O and draws
- "New Round" and "Reset Scores" buttons
- Responsive layout, keyboard accessible (buttons + focus rings)

## Files

```
tic-tac-toe/
├── index.html    # markup
├── style.css     # styles
├── script.js     # game logic
├── vercel.json   # static hosting config (optional)
├── .gitignore
└── README.md
```

## Run it locally

No build step, no install. Either:

- Double-click `index.html`, or
- Serve it so it behaves exactly like production:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Push to GitHub

```bash
cd tic-tac-toe
git init
git add .
git commit -m "Initial commit: tic tac toe"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Create the empty repo on GitHub first — do not initialise it with a README, or you will get a merge conflict.)

## Deploy to Vercel

**Option A — dashboard (easiest)**

1. Go to <https://vercel.com/new>.
2. Click **Import Git Repository** and pick the repo you just pushed.
3. Framework Preset: **Other**. Build Command: leave empty. Output Directory: leave empty (or `.`).
4. Click **Deploy**. Your site goes live at `https://<project>.vercel.app`.

**Option B — CLI**

```bash
npm i -g vercel
cd tic-tac-toe
vercel        # follow the prompts, accept the defaults
vercel --prod # promote to production
```

## Test checklist

After deploying, verify:

- [ ] Page loads and the board is a 3x3 grid
- [ ] X and O alternate in 2-player mode
- [ ] Diagonal, row and column wins all highlight correctly
- [ ] Filling the board with no winner shows "It's a draw."
- [ ] Scoreboard increments for X, O and draws
- [ ] "New Round" clears the board, keeps the scores
- [ ] "Reset Scores" clears the board and the scores
- [ ] vs Computer: the computer never loses (try to beat it)
- [ ] Clicking an occupied square does nothing
- [ ] Works on a phone-sized screen

## Licence

MIT — do whatever you like with it.
