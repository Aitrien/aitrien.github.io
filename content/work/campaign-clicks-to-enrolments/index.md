---
title: From campaign clicks to enrolments
accession: LM-W-005
date: 2026-10-25
summary: GA4 reporting for Ara that followed prospective students from a campaign link to a completed enrolment, so marketing could see where people dropped out while recruitment was still running.
role: Web developer, Ara Institute of Canterbury
stack: [GA4, Google Tag Manager, Google Ads, JavaScript]
status: live
tags: [analytics, data, javascript]
thumb: thumb.svg
hero:
  src: hero.png
  alt: A line drawing of a funnel report on a board. Three bars step down from left to right, and above the shorter two a dashed outline reaches up to the height of the bar before. In front, a table of three rows, marked with one, two and three dots, each with a flat bar of its size. The last bar and its row are green.
  caption: Seeing data drawn out can make exploring it, and making sense of it, more engaging.
draft: false
---

Marketing at Ara could see how many students enrolled, but the journey that led there was spread across separate reports. I put together tracking and reports that brought it into one place, from a campaign link to a completed enrolment, then trained the marketing specialists to use them, so they could judge a campaign while it was still running.

## Problem

Successful enrolments were reported through the Learner Management System. The data about what happened before them existed, but not in one place, and it couldn't be filtered quickly. That made the larger picture hard to see: how many prospective students reached a programme page, where they dropped out, and which campaigns and channels brought in the people who went on to enrol.

That made it hard to judge a campaign while recruitment was underway. Sometimes enrolment numbers decided whether a programme would run the next semester, so the insight had to arrive in time to act on.

## Constraints

- **The end of the journey wasn't on the website.** Enrolments lived in the Learner Management System. The website could only see the page a student reached once their enrolment was complete.
- **Many people made campaign links.** Each marketing specialist tagged their own links, so the tags were only as consistent as the people typing them.
- **The readers weren't analysts.** The reports were for marketing specialists, some of them new to GA4, so a report had to be usable, not just complete.
- **The answer had to come during recruitment.** A report that only made sense once the semester's numbers were final would have been too late.

## Approach

### Consistent campaign links

I built a campaign URL generator so marketing specialists could create tagged links without assembling each UTM parameter by hand. It offered fixed choices for source, medium, campaign layer and campaign location, based on the platforms and media Ara used, alongside a free-text campaign name and an optional content descriptor. Every link came out in the same shape, so website activity could be split by campaign in GA4.

I also linked Ara's Google Ads account to its GA4 property, so advertising and website measurement fed the same reports.

### Choosing where the funnel lives

I compared reporting options in Google Analytics 4, Microsoft Clarity and Looker Studio before settling on GA4's Funnel Exploration as the main tool. It shows how many people move through each defined stage, and where the rest drop out.

### Two funnels

- **Detailed:** ten steps covering the wider enrolment journey.
- **Simplified:** three stages: programme page views, apply-button clicks and completed enrolments.

The last stage is a GA4 key event that fires on the enrolment-complete page, the one point where the website sees the outcome the Learner Management System records.

### Slicing it the way marketing works

I set up reporting dimensions so the funnels could be filtered by programme, subject, campaign, device type and the campaign link's own parameters. Subject-level tracking used GA4's `select_content` event, so staff responsible for a portfolio of subjects could look at just the ones they managed.

Other reports supported particular campaigns, such as semester recruitment, open days and international marketing. Some of these needed custom JavaScript in Google Tag Manager to supply the data the report relied on.

### Teaching people to read it

After the reports went live, I trained the marketing specialists to move through the funnels, apply filters and interpret what they saw. Weekly catch-ups were a chance to review campaigns in progress, answer questions and show how to dig into a particular part of the data.

## Outcome

Marketing could now see, in one place, what happened between a first campaign visit and a completed enrolment. Instead of waiting for final enrolment counts, they could look at engagement on the website, compare campaigns and spot where people were dropping off while recruitment was still running, and make better-informed decisions because of it.

| Report | Steps | What it showed |
|---|---|---|
| Detailed funnel | 10 | The wider enrolment journey, step by step |
| Simplified funnel | 3 | Programme page views, apply clicks and completed enrolments |
| Campaign reports | Varied | Semester recruitment, open days and international marketing |
{caption="Reports | What marketing could see, and in how much detail"}

## What I'd change

The hardest part was balancing detail against usability. The ten-step funnel gave the fuller picture, but its volume of figures could overwhelm staff who were less familiar with GA4.

If I did it again, I would build around fewer, more meaningful stages, and organise campaign filtering the way marketing specialists already think about their work, particularly by Google Ads and Meta campaigns. I would also try a more focused Looker Studio view for everyday questions, and keep GA4 for detailed analysis.

The project taught me that good analytics is more than collecting events. The tracking has to be consistent, the reports have to answer practical questions, and the people reading them have to know how to interpret what they see.

## Credits

The hero is drawn with [Hairline](https://hairline.lucasmarkes.com/) by Lucas Marques, released under the MIT licence, in MotifSpec's colours.
