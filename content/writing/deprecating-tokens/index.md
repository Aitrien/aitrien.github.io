---
title: Deprecating design tokens without a major version
accession: LM-P-003
date: 2026-10-17
summary: "Sample post: why brand-codex 1.7.0 kept two unused tokens, and how the validator stops anything from using them."
tags: [design-tokens, design-systems, hugo]
draft: false
---

The specimen plate used to pulse. When it became a contour survey, two motion tokens lost their only user, and the obvious change was to delete them. Under semantic versioning that is a major release, and for a Hugo module a major release has a cost most people don't expect.

## The cost of a major version

Go modules, which Hugo Modules are built on, put the major version in the import path from version 2 onwards. A brand-codex 2.0.0 would live at a new path, so every site would have to change its import, not just its pin. Removing two tokens nobody used was not worth that.

Releases are also permanent once they are out:

> Once a versioned package has been released, the contents of that version MUST NOT be modified. Any modifications MUST be released as a new version.
>
> — Tom Preston-Werner | [Semantic Versioning 2.0.0](https://semver.org/)

## Deprecate first

So 1.7.0 restores both tokens and marks them with `$deprecated`, which the design tokens format allows on any token. The reason and the removal version go in the value, so whoever reads the token knows why it is still there and when it goes.

```diff {file="tokens/motion.json"}
       "drift": {
-        "$value": "{primitive.motion.duration.5}",
+        "$value": "{primitive.motion.duration.6}",
         "$description": "Time the specimen plate's terrain takes to drift one noise unit, …"
+      },
+      "pulse": {
+        "$value": "{primitive.motion.duration.5}",
+        "$description": "One full cycle of the specimen plate's outward pulse. …",
+        "$deprecated": "Unused since the contour plate; removed in 2.0.0."
       }
```

> [!NOTE]
> Deprecated tokens still ship. The generated CSS keeps them with a comment and the JSON export marks them, so a site that uses one keeps working.

### What changes in the version rules

Deprecation is a minor change, because nothing breaks. Removal stays major, and now it happens only when it is due.

| Change | Bump | Module path |
|---|---|---|
| Rename or remove a semantic token | major | changes |
| Add a token, a component doc or an icon | minor | unchanged |
| Deprecate a token | minor | unchanged |
| Change a value or fix a description | patch | unchanged |
{caption="Version rules | From CONVENTIONS.md"}

## Making it stick

A deprecation nobody enforces is a comment. The validator now fails if any component, the syntax mapping, a script or a component doc uses a deprecated token. Here it is catching one, after I pointed the plate back at the pulse duration to test it:

```console
$ npm run validate
✗ css/components.css: uses deprecated motion.duration.pulse (Unused since the contour plate; removed in 2.0.0.)
283 tokens (145 semantic, 2 deprecated), 95 contrast pairs × 2 themes.
1 rule errors, 0 failing pairs.
```

### Tags are forever too

> [!CAUTION]
> Never move or delete a published tag. Sites pinned to it, and the Go checksum database, expect the same contents at that version for good.

When 2.0.0 does come, it will carry these removals and anything else that has waited for it, and the sites will move once.
