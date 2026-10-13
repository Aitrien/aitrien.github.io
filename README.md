# portfolio (aitrien.github.io)

Portfolio and blog. Hugo, deployed to GitHub Pages by `.github/workflows/deploy.yml`.

```sh
hugo server          # local preview at http://localhost:1313
hugo --minify        # production build into public/
```

Requires Hugo **extended** ≥ 0.146 and Go (for Hugo Modules).

Styles come from the brand-codex repo from Phase 2 onward. Don't add new colors or sizes to `assets/css/main.css`. They belong in brand-codex as tokens.
