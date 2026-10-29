---
title: MotifSpec
accession: LM-W-002
date: 2026-10-16
summary: "Sample case study: a design system of DTCG tokens, component rules and generated CSS, written so people and AI assistants can follow it."
role: Sole engineer
stack: [DTCG tokens, Node, Hugo Modules, npm]
status: live
tags: [design-systems, design-tokens, accessibility]
hero:
  src: showcase.png
  alt: The MotifSpec showcase page, with its headline, buttons, an accession label and the contour plate, over the blurred contour backdrop.
  caption: The showcase is generated from the same tokens and component files that sites import.
aliases: [/work/brand-codex/]
draft: false
---

MotifSpec is the one place my projects get their colours, type, spacing and components from. It was called brand-codex until version 1.10.0. It ships as a Hugo module and an npm package, and every rule in it is written as an instruction, because an AI coding assistant reads it as often as I do.

You can browse it at [motifspec.com](https://motifspec.com), the showcase in Plate 1: its foundations, components, page templates and checks, built from the same files that sites import.

## Problem

Each new project started by copying CSS from the last one. Values drifted, dark mode was an afterthought, and contrast was checked by eye, if at all. When I asked an assistant to add a page, it invented new colours because nothing told it which ones existed or what they were for.

## Constraints

- **No runtime dependencies.** The build is plain Node, so it runs anywhere and nothing has to be updated to keep it working.
- **Both themes are first class.** Every colour has a light and a dark value, and both are measured.
- **Pinnable releases.** Sites import a tagged version and only change when I move the pin.
- **Readable by machines.** Every semantic token carries a usage rule in its description, not just a value.

## Approach

### Tokens with usage rules

Tokens follow the Design Tokens Community Group format in two tiers. Primitives hold raw values; semantic tokens alias them and say when to use them. A site only ever sees the semantic tier.

```json {file="tokens/color.json"}
"accent": {
  "border": {
    "$value": "{primitive.color.sap.600}",
    "$type": "color",
    "$description": "Accent rules that mark the active item. Not for static decoration."
  }
}
```

### Contrast as a build step

Foreground tokens declare which surfaces they sit on and the ratio they need: seven for reading text, four and a half for labels, three for controls and graphics. The validator measures every pair in both themes, and the build stops if one fails.

![Table of contrast pairs, each with a light and a dark sample, its ratio and a pass result.](contrast-pairs.png "Every declared pair is measured in both themes on every build. This is the dark half of the table.")

### Hugo as the delivery format

The repository is also a Hugo module. Its own configuration mounts the generated files and the fonts, so a site needs one import line and a pinned version. The module also carries a Hugo partial for every component and the render hooks that turn Markdown into figures, tables, code blocks and callouts, so a site writes only its page templates and content. When a partial and its component doc disagree, the doc is the contract: the partial is fixed here, and every site gets the fix with the next release.

Projects that aren't Hugo sites install the same release from npm as `@aitrien/motifspec`, pinned to an exact version.

## Outcome

Version 1.7.0 was the first tagged release, and this site was the first consumer. MotifSpec is now at 1.16.0.

| Measure | Value |
|---|---|
| Tokens | 299 |
| Semantic tokens | 153 |
| Contrast pairs, each checked in two themes | 95 |
| Component docs | 20 |
| Icons in the sprite | 16 |
| Font payload in KB | 88.0 |
| Releases from 1.0.0 to 1.16.0 | 29 |
{caption="MotifSpec 1.16.0 | From npm run build and the changelog"}

The showcase is published at [motifspec.com](https://motifspec.com) with every release, alongside the npm package and an MCP server for AI assistants. [MotifSpec MCP server and release pipeline](/work/design-spec-to-prototype/) covers how a release reaches each of them.

## What I'd change

I would start with deprecation rules on day one. Removing two unused tokens forced a choice between a major version, which changes the module path, and keeping them a little longer. The second option was right, and now the validator enforces it.
