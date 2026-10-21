---
title: No flash of the wrong theme
accession: LM-P-002
date: 2026-10-16
summary: "Sample post: a one-line script in the head applies a stored theme before the first paint, and the toggle clears it when you match the system again."
tags: [javascript, accessibility, design-systems]
draft: false
---

A theme toggle that stores your choice has one job on the next visit: show that choice from the first frame. If the page paints in the system theme and then switches, you see a flash, and on a dark screen at night it is a bright one.

## Why the flash happens

The toggle's script loads with `defer`, so it runs after the document is parsed. By then the browser may already have painted the page with the colours `prefers-color-scheme` asked for. The stored choice arrives one frame too late.

## The snippet

The fix is a single inline script in `<head>`, before the stylesheet. It runs while the parser is still in the head, so the theme attribute is on `<html>` before anything in the body is drawn.

![The site header in the light theme, with the moon icon that switches to dark.](header-light.png "In the light theme the toggle shows a moon: it names the action, not the state.")

### What it reads

It reads one key, `cx-theme`, and accepts only `light` or `dark`. Anything else, including no key at all, means follow the system, so the attribute is left off.

```console
$ wc -c < dist/theme-init.js
135
```

### What it does when storage is blocked

Some browsers throw when a page touches storage in a private window. The snippet catches that and does nothing, which leaves the page following the system: the right answer when there is no choice to restore.

> [!WARNING]
> Don't load the snippet with `defer` or as a module. Either one runs it after parsing, which is exactly when the flash has already happened.

## Following the system again

The toggle has two states you can see but three you can be in: light, dark, and following the system. Each click flips what you see. If the result matches the system, the stored choice is cleared, so the page follows the system again from then on.

```ts {file="theme.ts" hl_lines=[18]}
type Theme = 'light' | 'dark';
type Preference = Theme | 'auto';

const KEY = 'cx-theme';
const system = matchMedia('(prefers-color-scheme: dark)');
const systemTheme = (): Theme => (system.matches ? 'dark' : 'light');

function read(): Preference {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'auto';
  } catch {
    return 'auto'; // storage blocked: follow the system
  }
}

const flip = (p: Preference): Theme => ((p === 'auto' ? systemTheme() : p) === 'dark' ? 'light' : 'dark');
const next = (p: Preference): Preference => (flip(p) === systemTheme() ? 'auto' : flip(p));
```

![The site header in the dark theme, with the sun icon that switches back to light.](header-dark.png "After one click the toggle shows a sun. If the system is dark, the stored choice is cleared rather than set.")

## Checking it

Store a choice, reload, and read the attribute before the stylesheet has loaded. With the snippet in place it is already set. Without JavaScript the toggle never appears and the page follows the system, so there is no control that does nothing.

> [!TIP]
> If your Content-Security-Policy blocks inline scripts, allow this one by its hash instead of moving it into a file.

The snippet ships with MotifSpec as `dist/theme-init.js`, and the header component documents it, so every site that uses the toggle gets the same fix.
