# portfolio (aitrien.github.io)

Portfolio and blog. Hugo, deployed to GitHub Pages by `.github/workflows/deploy.yml`.

```sh
hugo server          # local preview at http://localhost:1313
hugo --minify        # production build into public/
```

Requires Hugo **extended** ≥ 0.146 and Go (for Hugo Modules).

The design comes from the [MotifSpec](https://github.com/Aitrien/motifspec) module, pinned in `go.mod`: the CSS and scripts, the component partials (`partial "motifspec/…"`) and the Markdown render hooks. See its `docs/hugo.md`. This repo has no CSS and no component markup of its own; `scripts/audit.mjs` enforces the first.

What lives here: content, the page templates in `layouts/` (which arrange the MotifSpec partials), the footer, the favicon, page metadata, and `layouts/_partials/checks/accession.html` (this site's catalogue numbering and front-matter rules). A new colour, size or component belongs in MotifSpec as a release, not here.
