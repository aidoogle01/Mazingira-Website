# Avoiding "AI slop" in an AI-assisted rebuild of mazingirasafari.com

Research date: 2026-10-26. Method: WebSearch plus WebFetch. Many WebFetch calls failed with DNS errors (claude.com, capitalandcompute.net, prg.sh, jackroberts.ai, murmurcast.com, chooseto.ai, codemyspec.com, twoframestudio.lovable.app). Where only a search-engine snippet or summary was available, the finding is marked **(snippet only)**. Primary sources that were fetched in full: Anthropic's `frontend-design` SKILL.md on GitHub, and a third-party GitHub note summarising Jack Roberts' Aug 2026 design video.

## 1. What are the recognisable AI-generated website tells?

### Takeaway
There is broad agreement on the first set of AI defaults: purple/indigo gradients, Inter everywhere, a centred hero above three icon feature cards, and every section in a rounded card. The more useful finding for this project is that Anthropic's own current frontend-design skill now treats the *second* set as tells too. These are the "tasteful" fallbacks that models switch to when told to avoid purple: a warm cream background with a serif and a terracotta accent, near-black with one acid accent, and broadsheet/editorial hairline layouts. An earthy safari brand will drift straight into that first fallback unless it is controlled deliberately.

### Cited Findings
**Anthropic's official guidance** (fetched in full: `anthropics/skills`, `skills/frontend-design/SKILL.md`, current main branch, Oct 2026):
- The skill tells the model to work like a design lead who gives each client its own identity. Choices about palette, type and layout should be deliberate and specific to the brief. — [Anthropic frontend-design SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- The skill says to "start from the subject: its industry, audience, materials, and vernacular". The hero should open with "the most characteristic thing in the subject's world". Make one element memorable, keep everything else quiet, and cut decoration that doesn't serve the brief. — [same](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- Typography: one family, or two that are clearly distinct, chosen for this brief rather than out of habit. Set an explicit type scale. Keep lines under about 80 characters; serif body text can run a little longer and needs more line-height. — [same](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- Colour: define a base palette of 4–6 named hex values. — [same](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- Motion: use it sparingly, as one orchestrated moment rather than scattered effects. Respond to user actions and respect reduced-motion settings. — [same](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- Layout process: write a layout concept with one-line descriptions and ASCII wireframes, and state the alignment choice. Structural devices (rules, numbering, labels) should carry information. There is a quality floor of responsiveness, visible keyboard focus and accessible contrast. — [same](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- **The skill's list of defaults that "read as generated"** (paraphrased by the fetch tool):
  - a warm cream background with a high-contrast serif and a terracotta accent (especially near #D97757);
  - near-black with a single acid-green or vermilion accent;
  - broadsheet layouts with hairline rules, zero border-radius and dense newspaper columns;
  - SaaS card kits: identical rounded cards, one radius for everything, the same soft grey shadow, gradient washes;
  - tracked-out all-caps eyebrow labels;
  - meta strings joined with middle dots, and "WORD — fragment" labels;
  - monospace type for small data labels;
  - arrows appended to link and button text;
  - one word in a headline accented in italic, bold or colour;
  - 01/02/03 numbered markers when the content isn't really a sequence;
  - the big-number + small-label + gradient-accent hero;
  - fade-and-slide-up on every section and a hover effect on every card;
  - unnecessary labels above content.

  — [same](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- Earlier versions of the skill, as reported second-hand, named Inter, Roboto, Arial and system fonts, purple-on-white gradients, cookie-cutter SaaS layouts and emoji used as icons. Authorship is credited to Prithvi Rajasekaran and Alexander Bricken, with a pointer to a "Frontend Aesthetics" cookbook. — [Medium, N. Porter, "The Anti AI-Slop UI Design Skill"](https://medium.com/@porter.nicholas/anthropic-skills-marketplace-the-anti-ai-slop-ui-design-skill-a572d0cfef4f) **(snippet only)**; [agenticskills.io listing](https://agenticskills.io/skills/frontend-design) **(snippet only)**
- Justin Wetch criticises an older instruction in the skill: "never converge on common choices like Space Grotesk across generations". His point is that Claude can't see its other generations, so it cannot follow that rule. — [Justin Wetch, "Improving Claude frontend"](https://www.justinwetch.com/blog/improvingclaudefrontend) **(snippet only)**

**Commentary sources:**
- One explanation traces the purple to Tailwind UI's default indigo button colour, which models then learned as the norm. — ["Why Your AI Keeps Building the Same Purple Gradient Website", prg.sh](https://scour.ing/@emschwartz/p/https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website) **(snippet only)**
- Other tells named: Inter on every heading, button and paragraph; "three boxes with icons arranged in a grid"; every section inside a rounded rectangle. — ["How to Stop Your Vibe Coded Website From Looking AI Generated" (Notion)](https://app.notion.com/p/How-to-Stop-Your-Vibe-Coded-Website-From-Looking-AI-Generated-3a264170dad0804eb2f2ef31591e60ab); [summify summary of "common mistakes with vibe-coded websites"](https://summify.io/discover/common-mistakes-with-vibe-coded-websites-DNSXlB/) **(snippet only)**
- Swapping a single font or colour isn't enough, because agents fall back to a second set of defaults. Ban purple and you tend to get warm cream with a terracotta accent, or near-black with one acid-green highlight. — ["How to Fix AI Slop in Web Design, Tell by Tell", Capital & Compute](https://capitalandcompute.net/blog/fix-ai-slop-design/) **(snippet only; page fetch failed)**
- A community Claude skill, "unslop-ui", targets AI-purple gradients, Inter/Geist fonts and the centred-hero-plus-three-feature-cards layout. — [skillsmp.com, unslop-ui](https://skillsmp.com/creators/iamneilroberts/claude-skills/skills-unslop-ui) **(snippet only)**
- Cause, as framed by design press: the AI gives the most probable result for a prompt, which is a composite of similar sites. — [Web Designer Depot, "The 'Vibe Coding' Crisis"](https://webdesignerdepot.com/the-vibe-coding-crisis-is-web-design-becoming-a-commodity/) **(snippet only)**; [zoer.ai guide](https://zoer.ai/posts/zoer/fix-vibe-coded-websites-design-guide) **(snippet only)**
- A designer's essay on a 2026 "anti-vibe-coding" movement says the author's own AI-built portfolio came out with the same gradients and button radii as dozens of others. — [Medium, "The 'Anti-Vibe Coding' Movement" (2026)](https://medium.com/@Rythmuxdesigner/the-anti-vibe-coding-movement-why-designers-are-rejecting-ai-generated-mediocrity-in-2026-b241ce60a369) **(snippet only)**
- Jack Roberts groups AI tells into five areas: typography, imagery, hierarchy, colour and spacing. — [GitHub summary of his video NAumQObJEwM](https://github.com/zarkadoulasa/claude-knowledge/blob/main/Sources/Jack%20Roberts%20-%20Design%20Systems%2C%20Critic%20Loops%20and%20a%20Design%20OS.md)

### Inferences
- **Safari-specific trap:** the obvious safari palette (sand/cream, ochre, terracotta, deep green, a serif) is very close to the default Anthropic now lists as "reads as generated". The fix is not to avoid earth tones. The palette should come from Mazingira's own photography and assets (actual grasses, kanga/kitenge textiles, Tanzanian soils), not a generic "Africa" palette, and be pinned down as named hex tokens. Don't let the model pick "warm cream + serif + terracotta" on its own.
- **Copy tells:** the brief's examples (Unlock / Elevate / Seamless / "curated", fake stats, fake testimonials) weren't covered by a single primary source I could fetch. For a safari brand, likely equivalents are "unforgettable", "once-in-a-lifetime", "breathtaking", "immerse yourself", "hidden gems", and invented review counts. This is synthesis, not a cited finding.
- **Working checklist for reviewers:** the Anthropic avoid-list (above), plus the first-generation tells (purple gradients, Inter/Geist/Space Grotesk, glassmorphism, emoji icons, bento grids, uniform rounded cards, three-card features, stock imagery).

### Gaps
- I couldn't fetch the full Capital & Compute, prg.sh or codemyspec articles, so the exact tell-by-tell fixes are unverified.
- I didn't find or verify specific Reddit or X threads in this pass.
- I found no NN/g article specifically on AI-generated visual design.

## 2. Workflows and techniques practitioners use to get distinctive output

### Takeaway
Practitioners agree that better adjectives in prompts don't fix generic output. What works:
- **Up-front constraints:** a real design system/tokens, real assets, and a chosen aesthetic direction.
- **Reference-driven prompting:** a benchmark site or screenshot, or a pasted design spec.
- **Generate → critique against the reference → regenerate loops:** human or subagent critics.

### Cited Findings
- Anthropic's skill has the model commit to an aesthetic direction before coding. Older versions offered tone options from "brutally minimal" and "maximalist" through to "retro-futuristic" and "brutalist/raw". — [skillselion listing of Anthropic frontend-design](https://skillselion.com/skills/fcakyon/claude-codex-settings/anthropic-frontend-design) **(snippet only)**; current version: ASCII wireframe layout concept, 4–6 named hex palette, one memorable element — [SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- Several sources say to set explicit design decisions (theme, colour, type, layout) at the start rather than prompting page by page. One argues the fix is "generate, evaluate, specify what's wrong, regenerate", not better prompts. — [Medium Design Bootcamp, "Why your vibe-coded designs look generic. The fix isn't better prompts."](https://medium.com/design-bootcamp/why-your-vibe-coded-designs-look-generic-the-fix-isnt-better-prompts-09e2fda26591) **(snippet only)**
- **Pasting design-system specs:** Jack Roberts pastes a real product's spec (palette, typography, Tailwind config, CSS variables, tokens) from a gallery of 2,000+ systems. The note suggests the gallery is Refero Styles. — [GitHub summary](https://github.com/zarkadoulasa/claude-knowledge/blob/main/Sources/Jack%20Roberts%20-%20Design%20Systems%2C%20Critic%20Loops%20and%20a%20Design%20OS.md)
- **Design-generator handoff:** Jack Roberts uses Google Stitch to generate design directions from competitor research, then connects it to Claude Code (via Antigravity) to build and deploy (Mar 22, 2026). — [jackroberts.ai, "I turned one prompt into a full website"](https://jackroberts.ai/p/i-turned-one-prompt-into-a-full-website) **(snippet only; fetch failed)**
- **Emil Kowalski** (design engineer, animations.dev) publishes a Claude skill based on his articles covering animation, design and performance. His public argument, as reported, is for restraint in animation, e.g. no animation on keyboard-triggered actions so they don't feel laggy. — [emilkowal.ski/skill](https://emilkowal.ski/skill) **(snippet only)**; [traeai summary](https://www.traeai.com/en/entities/emil-kowalski) **(secondary)**
- Dive Club newsletter: for practitioners like Kowalski, "craft" is richer than "visual design". — [Dive Club, "the robots insisted"](https://dive-club.beehiiv.com/p/the-robots-insisted) **(snippet only)**

### Inferences
A workflow for Mazingira that combines these sources (synthesis):
1. **Brand brief and tokens first.** Write a short art-direction doc covering subject, audience (UK HNW travellers), "vernacular" (Tanzanian heritage, guides, conservation), one memorable element, typefaces, a 4–6 hex palette sampled from real photos, a type scale, radius/shadow rules, and a motion budget. Save it as `DESIGN.md`/tokens in the repo and reference it in `CLAUDE.md`.
2. **Load the anti-slop rules.** Install Anthropic's `frontend-design` skill (or paste its avoid-list), and optionally Kowalski's skill for motion.
3. **Reference-driven builds.** Give the agent 2–3 benchmark screenshots from luxury travel and editorial sites as references for gap analysis. Use them for pacing and hierarchy, not as copy targets.
4. **Screenshot critique loop.** Render with Playwright, then have Claude (or critic subagents) compare against the benchmark and the brief's avoid-list. Cap the number of rounds, and have a human approve.
5. **Real content only.** Use real guide names and photos, real client testimonials with permission, and copy written in the client's voice. No placeholder stats.

### Gaps
- I didn't verify specific techniques from Rauno Freiberg, Riley Brown, Sajid, DesignCourse/Gary Simon, Flux Academy or Kevin Powell this session; searches returned nothing on them. Don't cite them without further research.
- I didn't verify Vercel v0, Lovable, Bolt or Framer AI guidance on design systems this session.

## 3. Jack Roberts: methods, results, and transferability

### Takeaway
Jack Roberts is a UK-based YouTuber, around 282K subscribers by third-party estimate, who focuses on Claude Code and AI automation. He sells a paid Skool community and frames his website videos as "$10,000 websites". His design method has three parts: paste a real design-system spec; get a benchmark "gap report"; run a critic-subagent loop until the output matches a benchmark screenshot. The *process* transfers well. His *references and aesthetic* (Apple, Linear, Anthropic, SaaS/product launches) and his speed-first "one prompt" framing do not.

### Cited Findings
**Who he is**
- UK-based; content covers Claude Code, AI agents, open-source tooling and no/low-code automation. About 282K subscribers and 17.2M views (third-party estimates). — [OutlierKit channel analysis](https://outlierkit.com/channel/itssssss-jack); [thesearchsherpa, "Best YouTube Creators for Claude Code 2026"](https://thesearchsherpa.com/best-youtube-creators-claude-code-2026/) **(snippets)**
- Bio claims: built and sold a startup with 60,000+ customers; Top-100 UK Entrepreneur. Runs a Skool community reported at $77/month with 2,400+ members. — [thesearchsherpa](https://thesearchsherpa.com/best-youtube-creators-claude-code-2026/) **(snippet; unverified third-party)**
- A reviewer says his content is "created with viewership metrics in mind first and practical depth second". — [thesearchsherpa](https://thesearchsherpa.com/best-youtube-creators-claude-code-2026/) **(snippet)**
- Website/newsletter: [jackroberts.ai](https://jackroberts.ai/). YouTube channel ID UCxVxcTULO9cFU6SB9qVaisQ — [Invidious mirror](https://invidious.logicism.tv/channel/UCxVxcTULO9cFU6SB9qVaisQ)

**Specific videos and posts**
- **"Turn Claude into a Design Genius... Just Watch"** — published 2026-08-12, 17:55, https://www.youtube.com/watch?v=NAumQObJEwM. The summary below is from [zarkadoulasa/claude-knowledge GitHub note](https://github.com/zarkadoulasa/claude-knowledge/blob/main/Sources/Jack%20Roberts%20-%20Design%20Systems%2C%20Critic%20Loops%20and%20a%20Design%20OS.md), a third-party summary; I didn't watch the video.
  - **Core claim:** Claude designs poorly because it "has rarely seen great design". He lists five tells: typography, imagery, hierarchy, colour, spacing.
  - **Level 1a:** paste a real design-system spec from a 2,000+ system gallery (the note guesses Refero Styles). Demo: Apple's spec applied to a titanium protein-shake brand site. He admits the result was imperfect and needed iteration.
  - **Level 1b:** "benchmark gap report". He asks Claude to compare his site (startup Glaido) to Linear's dark mode and return an HTML breakdown. Gaps found: letter-spacing too loose, no elevation ladder, hero art competing with the product. The report included sliders for shadows, accent frequency, radius and font weight.
  - **Level 2:** a "design loop" adapted from the "Gauntlet Loop". Three critic subagents (benchmark fidelity, design quality, visual impact) judge output against a benchmark screenshot until it matches. Demo: recreating Apple and Anthropic launch emails, then sending one via Zapier.
  - **Level 3:** "Design OS", a local Claude Code module. It generates images via Higgsfield, Kie AI, OpenRouter and OpenAI (Nano Banana 2) with per-generation cost, indexes his image library by content, and stores "style recipes" (text plus reference images).
  - **Note's caveats:** nothing reproducible is shown (no skill files, critic definitions, pass bar or round cap). The token cost is unstated (a third party cites ~2–3M tokens per run; unverified). The email recreations are close copies of other brands, which raises IP concerns. There is no human-approval gate on sends. The video includes a Glaido promo and a paid masterclass pitch.
- A Japanese summary describes the same video as answering three questions: how to make Claude understand good design, how to apply it in production, and how to build an organisational advantage (Design OS). — [note.com, "3 Techniques to Turn Claude into a Design Genius"](https://note.com/fond_egret3316/n/n326081498bca?hl=en) **(snippet)**
- **Stitch + Claude Code website post (2026-03-22):** Google Stitch generated page designs from competitor research; it was then connected to Claude Code through Antigravity, which built and deployed the site. Stitch then gave "15 redesign credits a day". The post links a walkthrough video, which I didn't identify. — [jackroberts.ai, "I turned one prompt into a full website"](https://jackroberts.ai/p/i-turned-one-prompt-into-a-full-website) **(snippet only)**
- Other titles reported on his channel/site: "Claude Fable 5 + New Design Skill = Beautiful $10,000 Websites", "I built a $10,000 app in one day" (2026-03-21), "How to use Claude Code FREE Forever (Openrouter)". — search snippets referencing [chooseto.ai index](https://chooseto.ai/creator/Itssssss_Jack) and [OutlierKit](https://outlierkit.com/channel/itssssss-jack) **(unverified; I couldn't fetch the pages)**
- "Build $10,000 Websites using Claude Code (Ultimate Guide)" (https://www.youtube.com/watch?v=VMvZuhcDdnw) appeared in results, but **I couldn't confirm it is his**. "I Built a $10,000 Website in 45 Minutes Using Free AI Tools (Claude Code + Google Stitch)" (https://www.youtube.com/watch?v=kjucWw_7WHw) is **not** confirmed as his and may be another creator's. — [search results](https://www.youtube.com/watch?v=VMvZuhcDdnw)

### Inferences (transferability to a luxury/heritage safari brand)
**What transfers:**
- **Benchmark gap reports.** Comparing our build to a named reference and getting concrete deltas (letter-spacing, elevation, hero competition, radius, accent frequency) is directly useful. Swap Linear for luxury travel and editorial benchmarks.
- **Critic-subagent loop against a screenshot.** Useful for closing the quality gap, but it needs explicit rubrics (our brief plus Anthropic's avoid-list), a round cap and human sign-off. His version lacks these.
- **Tokens/spec first.** Pasting a structured design spec before building is good practice, but the spec should be *Mazingira's own*, not Apple's.
- **Style recipes (text plus reference images).** Useful for keeping any generated or treated imagery consistent. But see the warning on AI imagery below.
- **His five-tell checklist** (type, imagery, hierarchy, colour, spacing) works well as a review rubric.

**What does not transfer:**
- **His references and aesthetic.** Apple, Linear and Anthropic are product/SaaS aesthetics: dark mode, elevation ladders, launch-email polish. A heritage safari brand needs documentary photography, editorial pacing and warmth. Linear-style precision would look wrong here.
- **AI-generated imagery** (Design OS / Nano Banana). For a brand selling authenticity, local guides and real places, generated wildlife, landscape or people imagery is a credibility risk and the strongest "AI" tell available. Use the operator's real photography; at most use AI for non-representational texture.
- **Close recreation of a benchmark.** His loop optimises for *matching* the benchmark, which leads to looking like someone else (and to IP risk, as the note flags). For Mazingira, benchmarks should inform pacing and quality, not be copied.
- **"$10,000 website in minutes" / one-shot framing.** A tailor-made luxury brand is differentiated by content (story, guides, conservation proof, itineraries), and AI speed doesn't supply that.
- **Automation reach** (Zapier sends, shared connectors). Irrelevant here and a governance risk.

### Gaps
- I didn't watch the videos or read transcripts; Section 3 relies on a third-party GitHub note and search snippets. Exact prompts, skill files and settings are **unverified**. The note says the video itself doesn't show them.
- I couldn't confirm the Refero Styles attribution, the Stitch walkthrough video's title and URL, or which "$10,000 website" videos are his.
- I didn't verify the Skool price, member count or the subscriber count from primary sources.
- I didn't examine visual examples of his resulting sites.

## 4. Principles from designers and design writing for distinctive (luxury/heritage) brand websites

### Takeaway
Sources on luxury and hospitality sites point to restraint. Full-bleed commissioned photography does the talking, typography stays quiet (often a classic serif with generous spacing), reveals are slow, and type, colour and motion stay consistent. Safari-specific advice adds: lead with inspiration and experiences, give activities their own pages with expert voice, and use real client photos with testimonials. Much of this comes from agency marketing pages, so treat it as practitioner opinion.

### Cited Findings
- Restraint is the line between luxury and merely attractive: "fewer elements and more air", "trust the reader". — [Two Frame Studio, "luxury design examples"](https://twoframestudio.lovable.app/journal/luxury-design-examples) **(snippet only)**
- "Type is quiet, imagery does the talking"; "original, commissioned photography — never stock, never over-edited"; reveals "slow enough to feel intentional"; type, colour and motion "agree with each other on every page". — [Two Frame Studio](https://twoframestudio.lovable.app/journal/luxury-design-examples) **(snippet only)**
- A travel-brand redesign case study: full-bleed cinematic photography opens the site while the typography (a classic serif, generous spacing) stays quiet, "more like a design magazine than a booking engine". — [Contra, Clark Baldwin Travel redesign by Kris Anfalova](https://contra.com/p/2UELPPFk-clark-baldwin-travel-website-redesign) **(snippet only)**
- A safari marketing agency recommends leading with destinations and experiences before packaged safaris. It also suggests dedicated activity pages (gorilla trekking, birding) with expert commentary, and testimonials paired with clients' own safari photos. — [African Safari Mag, "Work with us"](https://www.africansafarimag.com/work-with-us) **(snippet only; agency source)**
- A luxury travel web design article by an agency covers similar principles. — [MediaBoom, "luxury travel website design"](https://mediaboom.com/news/luxury-travel-website-design/) **(snippet only)**
- Anthropic's own guidance matches several of these: start from the subject's "materials and vernacular", one memorable element, quiet everything else, one orchestrated motion moment. — [SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md)
- Kowalski's position on animation restraint (as reported) supports a limited motion budget. — [traeai summary](https://www.traeai.com/en/entities/emil-kowalski) **(secondary)**

### Inferences
Translation for Mazingira (synthesis):
- **Hero.** Per Anthropic, open with "the most characteristic thing in the subject's world". For Mazingira that's a real guide, a real place or a real moment from their own trips, not a generic sunset-acacia stock shot.
- **Typography.** A characterful serif or display face chosen for heritage, plus a quiet text face. Avoid Inter/Geist/Space Grotesk. Also avoid the exact "cream + high-contrast serif + terracotta" combination by deriving colour from real photography and adding a distinctive secondary such as a deep savanna green, indigo or textile-derived colour.
- **Pacing.** Long-form editorial storytelling (heritage, founder, guides, conservation partners) with slower vertical rhythm. Avoid card grids. Itineraries should read as narratives with maps, not SaaS pricing tiers.
- **Trust.** Real named guides with portraits, verifiable conservation partners, ATOL/ABTA or similar UK-market proofs where they actually exist, and real reviews (e.g. linked TripAdvisor/Google). Never invented stats.
- **Motion.** One orchestrated moment (e.g. the hero image or a slow map reveal), no fade-up on every section, and support for reduced motion.

### Gaps
- I couldn't fetch full articles, so the specific luxury benchmark sites named (e.g. Singita, Wilderness, &Beyond, Aman) aren't analysed here. Another researcher may cover safari benchmarks.
- I found no design writing from Smashing Magazine, NN/g, Figma or Vercel specifically on luxury/hospitality brand distinctiveness this session.
