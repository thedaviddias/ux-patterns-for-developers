Absolutely—use fumadocs for the plumbing (MDX, content loading, search, routing helpers), but swap 100% of the UI so it feels like a modern gallery interface. Below is an updated PRD that makes that explicit and tells an AI/dev exactly what to keep from fumadocs and what to replace.

⸻

PRD — UX Patterns Gallery (MVP+)

App: apps/gallery
Goal: Modern gallery interface for Good/Bad UX examples using fumadocs as backend infra only, with a fully custom UI.

High-level approach
	•	Keep from fumadocs: MDX parsing, content pipeline, search utilities/indexing, file-based content conventions, TOC/build tooling you already use on uxpatterns.dev.
	•	Replace / customize: All page layouts, navigation chrome, cards, filters, typography scale, spacing, color tokens—everything visual and interactive. No default fumadocs components or theme in the final UI.

⸻

Scope (MVP)

Patterns: Load More, Expandable Text, Back to Top
Entries: 2–3 per pattern (PNG/WebP images only; videos later)
Pages:
	•	/ (Gallery home, modern interface)
	•	/gallery/[pattern] (Pattern grid)
	•	/gallery/[pattern]/[id] (Entry detail)
	•	/gallery/websites (Directory of websites)

Open-source contribution via GitHub PR (MDX + assets).
Fair-use screenshots for educational commentary (short caption per entry).

⸻

Information architecture & routing

apps/gallery/
  app/
    (site)/
      layout.tsx                  # custom chrome (no fumadocs UI)
      page.tsx                    # home
      gallery/
        [pattern]/page.tsx        # pattern grid
        [pattern]/[id]/page.tsx   # entry detail
        websites/page.tsx         # sites directory
  content/
    entries/
      load-more/*.mdx
      expandable-text/*.mdx
      back-to-top/*.mdx
  public/gallery/**               # images (webp preferred)
  lib/
    loadEntries.ts                # MDX loader using fumadocs helpers
    search.ts                     # build-time search index builder
    types.ts
  components/
    ui/…                          # all custom gallery components


⸻

Content model (MDX)

Minimal, future-proof. One idea per entry.

---
id: load-more-amzn-001
title: "Numbered pagination + “Load more” hybrid"
pattern: Load More            # exact pattern name used in docs
platform: web                 # web | mobile
type: good                    # good | bad
website: amazon.com
media:
  type: image                 # image | video (later)
  src: /gallery/load-more/amazon.webp
tags: [clarity, discoverability]
notes: "Avoids infinite scroll fatigue; footer remains reachable."
source:
  url: "https://www.amazon.com/s?k=..."
  capturedAt: "2025-09-08"
---

Rules
	•	Use WebP, ≤1200px wide, ≤200 KB when possible.
	•	Short caption (≤140 chars).
	•	Optional source for provenance; store only if public.

⸻

Visual language (modern gallery-inspired, clean & fast)
	•	Cards: large media thumb, small header row (pattern, verdict chip), title, website label.
	•	Filters bar (sticky on desktop):
	•	Platform: Web / Mobile toggle
	•	Pattern dropdown (only 3 in MVP)
	•	✅ Good / ❌ Bad toggle
	•	Search (fumadocs index; frontmatter fields + title + notes)
	•	Detail page: hero media, metadata chips (pattern, platform, website, verdict), short notes; Prev/Next within the same pattern.

⸻

Use fumadocs for…
	•	MDX parsing & frontmatter typing.
	•	Content discovery (files → structured nodes).
	•	Search indexing (build-time index + simple client query).
	•	MDX components if you ever annotate entries (not needed in MVP).

Implementation note: import only the minimal MDX/loader/search utilities; do not mount default fumadocs layouts or styles.

⸻

Replace with custom UI (shadcn + Tailwind)

All components below are yours (no fumadocs UI):
	•	EntryCard.tsx
	•	Filters.tsx (platform toggle, verdict toggle, pattern select, search input)
	•	VideoOrImage.tsx (images MVP; accept video URL later)
	•	WebsitePill.tsx
	•	PatternHeader.tsx (icon + short blurb pulled from your pattern docs later)

Tailwind tokens
	•	Rounded 2xl, generous gap-6, soft shadows, neutral surfaces (zinc/stone).
	•	Respect prefers-reduced-motion; no autoplay video in MVP.

⸻

Search (fumadocs under the hood)
	•	Build-time JSON index of: id, title, pattern, platform, type, website, tags, notes.
	•	Client: lightweight fuzzy search (debounced).
	•	Filters combine with search (AND semantics).

⸻

Performance / cost guardrails (Vercel free)
	•	All images via next/image with placeholder="blur".
	•	Ship precompressed WebP, no GIFs.
	•	Lazy-load images offscreen.
	•	No video in MVP; Phase 2 uses Bytescale (signed, muted, ≤8s, poster frame).
	•	Static rendering; avoid server actions.

⸻

Accessibility
	•	Alt text = teaching point, not “screenshot of…”.
	•	Verdict chips must pass 4.5:1 on text.
	•	Filters keyboard-focusable with visible focus rings.
	•	Detail page: landmark structure (main, nav for prev/next).

⸻

Integration with uxpatterns.dev & kit.uxpatterns.dev
	•	Each pattern doc (Load More, Expandable Text, Back to Top) gets a “Visual examples” card that links to /gallery/[pattern].
	•	Optional: embed 2–3 EntryCard previews (static).

⸻

Roadmap (beyond MVP)
	•	Phase 2: Video via Bytescale; media.type: video.
	•	Phase 3: Website pages /gallery/websites/[slug] with site bio + all entries.
	•	Phase 4: Tag collections (“Accessibility wins”, “Anti-patterns”).
	•	Phase 5: Submit-on-GitHub button → prefilled Issue/PR template.

⸻

Acceptance criteria (MVP)
	•	Home lists all entries with platform/pattern/verdict filters + search.
	•	Pattern pages show only that pattern and keep filters/search in sync.
	•	Detail page renders hero media + metadata + notes + prev/next.
	•	Images are optimized, lazy, blurred placeholders.
	•	No fumadocs UI visible; only MDX/search utilities used.
	•	Links from pattern docs to gallery pattern pages exist.

⸻

Tasks for the implementer/AI

1) Setup
	•	Create apps/gallery (Next.js App Router, TypeScript, Tailwind, shadcn).
	•	Install MDX + fumadocs helpers (loader/search) without their UI theme.
	•	Configure content glob: content/entries/**/*.mdx.

2) Data & types
	•	lib/types.ts → Entry interface matching frontmatter.
	•	lib/loadEntries.ts → read MDX, coerce to Entry[], sort by capturedAt desc.
	•	lib/search.ts → build JSON index at build time (Node script).

3) UI
	•	components/Filters.tsx (URLSearchParams for shareable filters).
	•	components/EntryCard.tsx (uses next/image).
	•	app/(site)/page.tsx → Home grid + filters + search.
	•	app/(site)/gallery/[pattern]/page.tsx → filtered grid by pattern.
	•	app/(site)/gallery/[pattern]/[id]/page.tsx → detail + prev/next.

4) Content (seed)
	•	Add 2–3 entries per pattern (use the three patterns you named).
	•	Compress to WebP, ≤200 KB, include good alt text.

5) Integration & links
	•	Add “Visual examples” link to each of the three pattern docs on uxpatterns.dev.
	•	Optional embed of 2–3 cards per doc.

6) QA
	•	Keyboard-only pass through filters and cards.
	•	Lighthouse ≥ 95 perf on desktop.
	•	No server errors on static export; images render blurred then crisp.

⸻

Example MDX seeds (drop-in)

content/entries/load-more/shop-grid-good.mdx

---
id: load-more-grid-001
title: "Load more with persistent footer"
pattern: Load More
platform: web
type: good
website: example-shop.com
media: { type: image, src: "/gallery/load-more/shop-grid.webp" }
notes: "Button keeps footer reachable; maintains scroll position; clear progress."
---

content/entries/expandable-text-article-bad.mdx

---
id: expandable-text-article-001
title: "Hidden critical info behind 'Read more'"
pattern: Expandable Text
platform: web
type: bad
website: news-site.com
media: { type: image, src: "/gallery/expandable-text/article-hidden.webp" }
notes: "Key terms hidden; poor affordance; harms scanability & SEO."
---

content/entries/back-to-top-sticky-good.mdx

---
id: back-to-top-sticky-001
title: "Accessible sticky back-to-top"
pattern: Back to Top
platform: mobile
type: good
website: blog.example
media: { type: image, src: "/gallery/back-to-top/sticky-button.webp" }
notes: "Visible only after scroll threshold, 44px target, aria-label, reduced motion."
---


⸻

Dev notes / gotchas
	•	Kill the default fumadocs CSS to avoid style leakage; namespace your styles.
	•	Use URLSearchParams for filters so links are shareable.
	•	Consider plaiceholder or similar to precompute blur data for images at build.
	•	Keep pattern names identical to docs to enable cross-linking without a mapping table.

⸻

If you want, I can also draft the exact types.ts, loadEntries.ts, and a minimal page.tsx skeleton next so an AI can scaffold the repo without guessing anything.
