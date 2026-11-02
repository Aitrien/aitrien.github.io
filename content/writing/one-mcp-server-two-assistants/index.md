---
title: One MCP server, two assistants
accession: LM-P-006
date: 2026-11-02
summary: "MotifSpec's MCP server worked in Claude the first time I added it. Gemini said it had trouble connecting. The difference was how forgiving each client is."
tags: [agentic-coding, design-systems]
draft: false
---

[MotifSpec](/work/motifspec/) has a hosted MCP server at `https://mcp.motifspec.com/mcp`, so any AI assistant can read the design system's rules and check its own markup against them. It's read-only and needs no sign-in. I built and tested it with Claude, where it worked the first time. When I added it to Gemini, it failed.

## Adding it to each

In Claude, the server is a custom connector: paste the address and it's available in any new chat. In a code project, Claude Code reads it from a small file in the repository:

```json {file=".mcp.json"}
{
  "mcpServers": {
    "motifspec": {
      "type": "http",
      "url": "https://mcp.motifspec.com/mcp"
    }
  }
}
```

In the Gemini app it's a custom connected app: under Connectors, choose Custom, paste the same address and choose Next. Google's help page lists a few conditions on the account: you have to be 18 or over, in the US, signed in with a personal Google Account, and have Keep Activity turned on. Gemini CLI uses a settings file like Claude Code's, but with one trap: there, `url` means the older SSE transport, and a Streamable HTTP server like this one needs `httpUrl` instead.

## Where Gemini stopped

Gemini's only message was "We had trouble connecting to this server. Contact the server provider for help." I was the server provider, so I sent the server the kinds of requests a stricter client might, and three of them failed:

| Request | Before | After |
|---|---|---|
| A GET, which some clients send after connecting to open a stream for live updates | Held open until the Lambda timed out after 10 seconds, then an error | Refused at once: the server has no updates to send |
| A request that accepts only JSON, anything, or doesn't say | Refused with 406 Not Acceptable | Answered in JSON, as every other request is |
| A browser's CORS check before calling from another site | Refused | Allowed: the server is read-only and has no sign-in |
{caption="What changed in MotifSpec 1.17.1 | The same requests, before and after"}

None of these stopped Claude. After the fix shipped in [MotifSpec 1.17.1](https://github.com/Aitrien/motifspec/blob/main/CHANGELOG.md), Gemini connected. I don't know which of the three it needed, because I fixed them together.

## What I'd take from it

The first of the three is the one I'd watch for. The MCP spec lets a server without live updates refuse that GET outright, but the library I used kept the request open instead, and nothing in my tests sent one. Claude worked regardless; Gemini didn't, and its error message couldn't say why. Testing a server only against the client you built it with tests that client's patience, not the server. Each request in the table is now a test, so the server is held to the stricter behaviour from here on.
