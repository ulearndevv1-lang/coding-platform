# CodeSpace (coding-platform)

React + Vite app with a marketing landing page and an in-browser coding practice workspace.

## Local development

```bash
npm install
```

### Option A — Frontend only (Python in browser)

```bash
npm run dev
```

Open `http://localhost:5173`. **Python** Run/Submit works without any backend. Other languages show a clear message that the server API is not available (no proxy to localhost).

### Option B — Full stack locally (all languages)

API routes are Vercel serverless functions in `/api`. Run them with the Vercel CLI (same origin as the app — **no** `localhost:3000` proxy required):

```bash
cp .env.example .env   # add JUDGE0_API_KEY and JUDGE0_API_URL
npx vercel dev
```

Open the URL Vercel prints (often `http://localhost:3000`). `/api/execution-config` and `/api/execute` are served on that host.

Visit **Home** (`/`) and **Practice** (`/practice`).

## Deploying to Vercel

1. Connect the repo to Vercel (`.vercel/project.json` may already exist).
2. Set environment variables in the Vercel dashboard (never commit real keys):
   - `JUDGE0_API_KEY`
   - `JUDGE0_API_URL` (e.g. `https://judge0-ce.p.rapidapi.com`)
   - `JUDGE0_RAPIDAPI_HOST` (optional, default `judge0-ce.p.rapidapi.com`)
3. `vercel.json` rewrites non-API routes to `index.html` for client-side routing.
4. API routes live under `/api/*` on the same origin — no `localhost` URLs in production code.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — ESLint

---

# React + Vite (template notes)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
