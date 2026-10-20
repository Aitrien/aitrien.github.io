---
title: The slider that moved one subject at a time
accession: LM-P-004
date: 2026-10-19
summary: "A Clarity heatmap showed that 80% of clicks on Ara's home page went to one arrow. Making each click move a full page of subjects brought that down to 34%."
tags: [analytics, ux]
draft: false
---

GA4 tells you where people went. It doesn't tell you what they tried to do on the way. When I added Microsoft Clarity to Ara's website, the first thing it showed us was something no report had: one small arrow doing most of the work on the home page.

## What a heatmap shows that analytics can't

Ara's home page has a subject slider. It shows five subject areas at a time, with an arrow to see more. Page views and events can tell you which subject pages people reach, but not how hard they worked to get there.

The Clarity heatmap could. Of all the clicks anywhere on the home page, 80% landed on the slider's right arrow.

## Five visible, one per click

The slider showed five subjects but moved only one each time the arrow was pressed. Anyone looking for a subject further along had to click again and again, watching the same four subjects shuffle across each time. The heatmap was recording people paging through a list one item at a time.

The fix was small: each click now moves the slider five subjects, a full page of new options.

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
