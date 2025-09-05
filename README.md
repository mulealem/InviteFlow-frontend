# InviteFlow – Frontend

A Vue 3 + Vite + Vuetify + Tailwind frontend for InviteFlow. It lets users:

- Analyze a DOCX template to extract placeholders and generate a CSV header
- Upload a DOCX + CSV to generate per-recipient PDFs with QR codes
- Download a merged PDF and/or a ZIP of all PDFs
- View an individual invite by QR token and download its PDF

This app talks to a backend API (see Configuration).

## Tech stack

- Vue 3 (router)
- Vite
- Vuetify 3 + Material Design Icons
- Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- InviteFlow backend running locally (default assumed: http://localhost:3008)

## Quick start

```bash
# 1) Install deps
npm install

# 2) Start dev server (http://localhost:5173)
npm run dev
```

During development, API calls to these paths are proxied to http://localhost:3008:

- /health
- /analyze-template
- /generate-documents
- /download
- /batches
- /view

This proxy is configured in `vite.config.js`.

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – production build to `dist/`
- `npm run preview` – preview the production build locally

## Configuration (API base URL)

API calls are built via `src/utils/api.js` using the env var `VITE_API_BASE_URL`.

- If `VITE_API_BASE_URL` is unset, the app uses relative URLs (good for Vite dev proxy).
- In production, set `VITE_API_BASE_URL` to your backend origin (e.g., https://api.example.com).

Create `.env` (or `.env.local`) in the project root if needed:

```bash
VITE_API_BASE_URL=https://your-backend.example.com
```

## Project structure

```
frontend/
  index.html
  netlify.toml           # SPA fallback for Netlify
  package.json
  postcss.config.js
  tailwind.config.js
  vite.config.js         # Dev proxy to backend
  public/
    templates/           # Sample DOCX + preview images (downloadable in UI)
  src/
    main.js              # Vuetify + Tailwind setup
    router.js            # Routes (single-page: /)
    assets/
    components/
      TemplateGallery.vue
    utils/
      api.js             # apiUrl/apiFetch helpers
    views/
      Landing.vue        # Hero + AppFlow
      AppFlow.vue        # Analyze + Generate steps, CSV preview, downloads
      Analyze.vue        # Focused analyzer view (optional)
      Generate.vue       # Focused generator view (optional)
```

## Using the app

1. Analyze a template
   - Upload a .docx with placeholders (e.g., {{name}}, {{event}}, ...)
   - App shows detected variables and a downloadable CSV header
2. Prepare CSV
   - Fill rows for each recipient using the provided headers
3. Generate documents
   - Upload the same .docx and your CSV
   - Download the merged PDF and optionally the ZIP of all PDFs
4. QR viewer
   - Paste a QR token to open the individual invite view or download its PDF

Sample templates are available under Templates in the UI (from `public/templates`).

## Deployment

This is a static SPA build. Common options:

- Netlify

  - `netlify.toml` already configures SPA fallback:
    ```toml
    [[redirects]]
      from = "/*"
      to = "/index.html"
      status = 200
    ```
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Environment: set `VITE_API_BASE_URL` to your backend URL

- Any static host (e.g., Vercel, GitHub Pages, S3+CDN)
  - Serve the `dist/` directory
  - Ensure SPA fallback to `index.html`
  - Set `VITE_API_BASE_URL` at build time (or use relative paths if backend shares origin)

## Troubleshooting

- API 404/Network errors in dev: ensure backend is running at http://localhost:3008 or adjust the proxy in `vite.config.js`.
- CORS in production: calls go to `VITE_API_BASE_URL`; configure CORS on the backend accordingly.
- Blank page after deploy: confirm SPA fallback is enabled (see `netlify.toml`) and that you’re serving the `dist/` folder.

## License

Add a license if needed (e.g., MIT) in a `LICENSE` file.
