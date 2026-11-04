# AGENTS.md

aitrien.com is Liam Marshall's portfolio, built on his design system, MotifSpec. `README.md` says what lives here, what comes from MotifSpec, and the checks to run.

## Design

Follow MotifSpec's README (Rules for AI assistants) and `docs/hugo.md` at the version pinned in `go.mod`. The MotifSpec MCP server (`.mcp.json`, `.vscode/mcp.json`) serves them, with the components, tokens and checker, for the latest release; when `go.mod` pins an older one, read them in the module folder that `hugo config mounts` reports, or on GitHub at that tag.

When a change needs something MotifSpec doesn't have, stop and say so: it's a MotifSpec release first, then a version update here (`hugo mod get github.com/aitrien/motifspec@vX.Y.Z`). Don't work around it in this repo.

## Content

- Case studies are page bundles in `content/work/`, posts in `content/writing/`, with their images beside `index.md`.
- The site uses MotifSpec's portfolio layout, declared in `hugo.toml`. Page structure and catalogue numbers are in MotifSpec's `docs/layouts/portfolio.md`, and front matter in its `docs/hugo.md`.
- It's Liam's own work and experience. Don't invent facts, figures, outcomes, quotes or credits; ask.
- Use New Zealand English spelling (colour, organise, enrolment).

## Before you finish

Run the checks in `README.md`. CI runs the same on every PR.

## Commits and pull requests

Keep the `Co-Authored-By` line, but don't add a Claude session link to commit messages or pull request descriptions.
