# portfolio (aitrien.github.io)

Portfolio and blog. Hugo, deployed to GitHub Pages by `.github/workflows/deploy.yml`.

```sh
hugo server          # local preview at http://localhost:1313
```

Requires Hugo **extended** ≥ 0.146 and Go (for Hugo Modules). Instructions for AI agents are in `AGENTS.md`.

The design comes from the [MotifSpec](https://github.com/Aitrien/motifspec) module, pinned in `go.mod`: the CSS and scripts, the component partials (`partial "motifspec/…"`) and the Markdown render hooks. See its `docs/hugo.md`. This repo has no CSS and no component markup of its own.

What lives here: content, the page templates in `layouts/` (which arrange the MotifSpec partials), the footer, the favicon, page metadata, and `layouts/_partials/checks/accession.html` (this site's catalogue numbering and front-matter rules). A new colour, size or component belongs in MotifSpec as a release, not here.

## Checks

CI runs these on every PR; run them before opening one:

```sh
node scripts/audit.mjs                   # MotifSpec's rule checker, from the pinned module, on layouts/ and content/
hugo --gc --minify --panicOnWarning      # production build into public/; any warning fails it
lychee --offline --include-fragments --index-files index.html --root-dir "$PWD/public" 'public/**/*.html'   # internal links and #fragments
```
