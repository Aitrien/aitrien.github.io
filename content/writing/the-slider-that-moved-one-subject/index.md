---
title: The slider that moved one subject at a time
accession: LM-P-004
date: 2026-10-19
summary: "A Clarity heatmap showed that 80% of clicks on Ara's home page went to one arrow. Making each click move a full page of subjects brought that down to 34%."
tags: [analytics, ux]
draft: false
---

GA4 tells you where people went. It doesn't tell you what they tried to do on the way. When I added Microsoft Clarity to Ara's website, the first thing it showed us was something no report had: one small arrow doing most of the work on the home page.

## A shortcut that added clicks

The slider went onto the home page about six months before Clarity did. Until then, the typical route to a programme was thought to run like this:

1. **Home page.**
2. **Study Interest Areas**, a grid of tiles for Ara's 20 subject areas, such as Health.
3. **A subject landing page.**
4. **A specialisation landing page.** Health, for example, contains Nursing, Midwifery and Medical Imaging, each with its own list of courses.
5. **The programme page.**

Putting the subject areas in a slider on the home page was meant to cut out the second step. Visually, it did: people could pick a subject without leaving the home page. But on average it took more clicks to convert than before, not fewer, and at the time we couldn't see why.

## What a heatmap shows that analytics can't

Page views and events could show which subject pages people reached from the slider, but not how hard they worked to get there.

The Clarity heatmap could. Of all the clicks anywhere on the home page, 80% landed on the slider's right arrow.

## Five visible, one per click

The slider showed five subjects but moved only one each time the arrow was pressed. With 20 subject areas, reaching the last one took 15 clicks, watching the same four subjects shuffle across each time. The heatmap was recording people paging through a list one item at a time, and those clicks were what the shortcut had cost.

There was a left arrow too, but it barely got clicked. The subjects ran in alphabetical order, so people read them from left to right, and moving right is the direction people naturally browse anyway.

The fix was small: each click now moves the slider five subjects, a full page of new options. Reaching the last subject area now takes three clicks instead of 15.

| Measure | Before | After |
|---|---|---|
| Share of home page clicks on the right arrow | 80% | 34% |
{caption="Subject slider | Clarity heatmap, home page clicks"}

## Reading the result

> [!NOTE]
> This is a share of clicks, not a count. When the arrow takes fewer of them, everything else on the page takes more.

The drop doesn't mean people stopped browsing subjects. A third of clicks still go to the arrow, so plenty of visitors still page through. What changed is how much each click does: the same browsing now takes a fraction of the effort, and the rest of the home page gets more of people's attention.

## Clarity as a reporting tool

The slider was the clearest single finding, but Clarity became part of how the team worked:

- **Following journeys.** Heatmaps and recordings made it easy to follow the common routes through the site and find the pain points along them.
- **Checking our own changes.** After a release, we filtered recordings to the pages we had changed and reported on how people were using them.
- **Following campaigns.** The same filters let us watch how visitors from a campaign behaved once they arrived.
- **Scroll depth.** GA4's built-in scroll event only fires when someone reaches 90% of a page. Clarity shows how far down people get across the whole page, which is far easier to read and act on.

Clarity only runs for visitors who allow it. It sits behind the same consent layer as the rest of Ara's analytics, which I wrote about in [Measurement under consent](/work/measurement-under-consent/).
