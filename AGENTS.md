# AGENTS.md

aitrien.com is Liam Marshall's portfolio, built on his design system, MotifSpec. `README.md` says what lives here, what comes from MotifSpec, and the checks to run.

## Design

Follow MotifSpec's README (Rules for AI assistants) and `docs/hugo.md` at the version pinned in `go.mod`. Read them in the module folder that `hugo config mounts` reports, or on GitHub at that tag.

When a change needs something MotifSpec doesn't have, stop and say so: it's a MotifSpec release first, then a version update here (`hugo mod get github.com/aitrien/motifspec@vX.Y.Z`). Don't work around it in this repo.

## Content

- Case studies are page bundles in `content/work/`, posts in `content/writing/`, with their images beside `index.md`.
- Page structure, catalogue numbers and front matter are in MotifSpec's `docs/templates.md` and `docs/hugo.md`.
- It's Liam's own work and experience. Don't invent facts, figures, outcomes, quotes or credits; ask.
- Use New Zealand English spelling (colour, organise, enrolment).

## Before you finish

Run the checks in `README.md`. CI runs the same on every PR.
