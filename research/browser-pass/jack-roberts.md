# Jack Roberts: what could be checked first-hand (26 Oct 2026)

## Access

| Source | Result |
|---|---|
| `youtube.com/watch?v=NAumQObJEwM` | Blocked. curl gets a 302 to `google.com/sorry`; a normal Playwright load gets HTTP 429 and the same "sorry" page. Description and transcript not reached. Not retried. |
| YouTube oEmbed (`youtube.com/oembed?url=…NAumQObJEwM`) | Works. Title "Turn Claude into a Design Genius... Just Watch", channel "Jack Roberts" (`@Itssssss_Jack`). Nothing else. |
| `jackroberts.ai` homepage | Cloudflare challenge (`cf-mitigated: challenge`). Not attempted further. |
| `jackroberts.ai/sitemap.xml` and `/p/<post>` pages | Work with plain curl (robots.txt allows `*` apart from `/login`). All 98 posts fetched, one per second. |

The newsletter archive runs from November 2025 to 1 May 2026. No post links video `NAumQObJEwM`, and none mentions critic loops, subagent judges, benchmark gap reports, Linear, or pasting a design-system spec. **The report's description of the August 2026 video therefore remains unverified third-party summary.**

## What his own posts show (verified)

- **"I turned one prompt into a full website"** (22 Mar 2026): Google Stitch (Gemini 3.1 design model) "generates full visual designs, page by page, based on competitor research it does itself". He asked it to "find the top three SaaS pricing pages and generate three different design directions"; it returned "typography, color palettes, layout strategies, and three complete visual mockups". He picked one, edited text on screen, had it make more pages in that style, then "connected it to Claude Code through AntiGravity", which built and deployed the site. Video: `youtube.com/watch?v=1aI7pAlkz4w`.
- **"$10,000 websites in 22 minutes"** (14 Mar 2026): "You scrape any existing website with Firecrawl so the AI knows what to build. Then Nano Banana 2 generates the 3D animations and interactive elements. Claude Code handles the rest." Deployed with AntiGravity. Video: `youtube.com/watch?v=TZUTe7s11-I`.
- **"I built two websites at the same time"** (4 Mar 2026): Stitch for design, AntiGravity for code and deploy, connected over MCP; "one prompt", six pages, "matched the brand guidelines", deployed to Vercel. The skills used are in his paid Skool community, not published.
- **"Ideas with Jack: AI just solved the UI problem"** (24 Nov 2025): moved "all of my website building over to Gemini 3.0" after comparing it with Lovable on the same prompt; "garbage in = garbage out. Find out what's working, share that with the model and ask it to replicate."

## What this changes

- Confirmed: his method is reference-led (competitor research, scraping an existing site, "replicate what's working") and the framing is speed ("one prompt", "22 minutes", "$10,000"). Imagery and motion are generated (Nano Banana).
- Not confirmed: the three-subagent critic loop, the Linear gap report and the five-area tell checklist. They may be in the August video, but nothing first-hand supports them.
- No prompts, rubrics or skill files are published openly; the skills are behind the Skool community.
