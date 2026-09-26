# Cloudflare deployment

Production: https://palengkehelper.betoniobrentdave.workers.dev

Cloudflare Workers Builds is connected to `betoniobrent/palengke-helper`.
Settings verified on September 26, 2026:

- Production branch: `main`
- Root directory: `/`
- Build command: empty (this site needs no build)
- Deploy command: `npx wrangler deploy`
- Include paths: `*`

`wrangler.jsonc` targets the existing `palengkehelper` Worker. `.assetsignore`
allows only the website files to be uploaded; SQL migrations, tests, backend
scripts, and repository metadata are excluded. Add any future public assets to
this allowlist.

Run `node --test tests/regressions.test.cjs`, review changes in VS Code Source
Control, then commit and push to `main`. Cloudflare will start a build and deploy
the new version. Check the Worker dashboard for a successful deployment.
Saving a file locally does not publish it.

Apply the Supabase migration in `migrations/` separately before publishing the
database fixes. Cloudflare only deploys the website; it does not run SQL migrations.

The existing `.github/workflows/pages.yml` and `static.yml` deploy to GitHub Pages,
not Cloudflare. They are not needed for Cloudflare's Git integration.
