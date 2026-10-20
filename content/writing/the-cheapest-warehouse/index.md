---
title: The cheapest warehouse was the one we already had
accession: LM-P-005
date: 2026-10-20
summary: "We planned to move Ara's analytics from GA4 through BigQuery to an Azure warehouse and Power BI. Costing it showed the data could simply stay in BigQuery for under a dollar a month."
tags: [analytics, data]
draft: false
---

Ara ran the free version of Google Analytics 4. It answers most day-to-day questions well, but it keeps detailed event data for at most 14 months. That is barely enough to compare one year with the last, and nowhere near enough to see longer trends. The marketing team and the data analysts wanted both.

## The plan

Working with Ara's data engineer, I set out a route that would keep the raw data for as long as we needed it and put it in front of the people who use it:

1. **GA4 to BigQuery.** GA4 can export every event to Google BigQuery each day, even on the free version.
2. **BigQuery to an Azure data warehouse.** BigQuery had a retention limit of its own, so the raw events would be copied to Azure for safekeeping.
3. **Azure to Power BI.** Analysts and marketing would explore long-term and year-on-year figures in dashboards, rather than learning GA4's own reports.

## The 60-day catch

The limit in step two came from where we started. The BigQuery sandbox needs no billing account, and in the sandbox every table expires after 60 days. The export was keeping less history than GA4 itself.

Turning on billing removes the expiry. That changed what the warehouse was for: once BigQuery could keep the data indefinitely, Azure was no longer needed to keep it safe, only to get it into Power BI.

## Costing the warehouse

So we costed both. Running an Azure data warehouse would have cost more than keeping the data on Google Cloud, and keeping it on Google Cloud cost almost nothing: once we passed BigQuery's free storage allowance, the bill came to around 30 to 40 cents a month.

We kept the data in BigQuery. The cheapest warehouse was the one we already had.

## Where it stopped

The last stage, connecting the data to Power BI, is where the project stalled. More pressing work came in, and it went to the backlog.

The decision still holds. Whenever the dashboards are built, the history they need is the part that was cheapest to keep.

## What I'd do differently

I would start from the dashboard and work backwards. One report that marketing actually used, even fed by a manual export, would have shown which data mattered and kept the project moving. We designed the pipeline first, and one stage of it turned out not to be needed at all.
