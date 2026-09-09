# ADR-004: One bordered layer per card, opt-in 3D background

**Status:** Accepted
**Date:** 2026-09-09
**Context:** Design review of cjunker.dev at e655778

## Context

A design review measured the deployed site at 1440x900 and 390x844 and found
three structural problems that no amount of copy editing would fix:

1. **Nested boxes crushed mobile.** Projects and Decisions were each wrapped in
   a `.brutal-card-v2` section frame, and every card inside repeated the same
   header-box + content-box structure. On a 390px viewport the Decisions text
   column was 94px wide (five borders between the page edge and the body text)
   and words broke mid-word. The page was 20,074px tall on mobile.
2. **No visual hierarchy.** Header, hero, sections, cards, card headers, card
   content, buttons, radar, legend, and footer all used the same 3px border and
   hard shadow. The halftone texture sat on seven adjacent cards and turned the
   grid into a wall of blue.
3. **2.5 MB first load, mostly unused.** Three.js (670 KB) loaded for a
   decorative background that defaulted on. Ten carousel images loaded eagerly
   (`loading="lazy"` is a no-op for absolutely positioned slides inside the
   viewport). `styles.css` was a four-deep `@import` waterfall.

## Decision

### One rule for weight

- Thick border + hard shadow is reserved for the **hero** and for **buttons**.
- Cards, section frames, and panels get a **thin border and no shadow**.
- Card headers are **typography**: title plus a 2px accent rule, never a
  second bordered box.
- The halftone texture appears only as a **10px band** on the three featured
  cards. Everything else is a plain surface.

Projects and Decisions are plain `<section>`s with `.section-title`, matching
About, Contact, and Tech Radar. `.brutal-card-v2` is the only bordered layer;
its padding is a custom property (`--card-pad`) that shrinks on mobile.

### Card anatomy

Every project card has the same shape:

```
[media]                    optional screenshot, bleeds to the card edge
Title                      + accent rule
tech · line                mono, small, not uppercase
One plain sentence.        what it is
▸ two or three proof points
[PRIMARY]  Secondary →     actions footer pinned to the bottom (margin-top: auto)
```

One boxed primary action per card (Live Demo if there is one, else Source),
then text links. Status pills replace actions on internal/contracted work.

### Screenshots live on cards, not in a carousel

The hero carousel is gone. Each screenshot sits on the card it belongs to,
where it is relevant to what the reader is looking at. Five images replace
ten; the five macOS-named PNGs (140-275 KB each) became two named webp files
at 25 KB. This also removes the WCAG 2.2.2 problem (auto-advancing slides with
no pause control and no touch controls).

### 3D background is opt-in and lazy

`scene-manager.js` loads with the page (5 KB) but Three.js and the two scene
scripts are only fetched when a visitor picks a scene from the single
"Background" control. The default is OFF. A saved preference from a previous
visit re-enables it. The control is one button bottom-right, shown only at
>= 1600px where there is a real gutter for it; the three separate
FOCUS/VILLAGE/PARTICLES buttons and the fixed theme switcher (which overlapped
the header corner) are gone. The theme dots now live inside the header.

### Tech radar

- Rings are sized by **area** (radius proportional to sqrt of cumulative blip
  count, with a minimum band width) so the ADOPT ring, which holds 22 of 35
  blips, gets the most space. ADOPT stays innermost (Thoughtworks convention);
  the intro copy was corrected to match.
- Blips are relaxed apart after placement so none overlap.
- Below 768px the SVG is hidden and the Technology Index renders expanded,
  grouped by quadrant with the ring as a tag on each entry.

### Stylesheets and fonts

Three `<link>` tags replace the `@import` chain. `css/patterns.css` (260 lines,
zero references) is deleted. Components that only the design-system demo page
uses moved to `css/demo.css`. JetBrains Mono (latin 400 + 700, ~21 KB each,
SIL OFL) is self-hosted with `font-display: swap`; uppercase text uses slightly
positive tracking instead of -1px.

## Consequences

Measured at the same viewports (headless Chrome, network idle):

| Metric                    | Before          | After           |
|---------------------------|-----------------|-----------------|
| Mobile page height        | 20,074 px       | 12,411 px       |
| Mobile decision text col  | 94 px           | 274 px          |
| Mobile project text col   | 148 px          | 274 px          |
| Desktop page height       | 7,027 px        | 5,473 px        |
| First-load requests       | ~30, 2.49 MB    | 18, ~0.5 MB     |
| Three.js on first load    | 670 KB          | 0 (opt-in)      |
| Carousel images on load   | 10 (~1.3 MB)    | 0 (5 on cards)  |

Trade-offs accepted:

- The 3D background is now invisible to most visitors (viewports under 1600px
  never see the control). It was decorative; the card screenshots are the
  visual interest now.
- The design-system demo page keeps its old nested-box look via `demo.css`;
  it is a component gallery, not the production page.
- Focus mode survives but only as a menu item inside the Background control.

## Follow-ups

- The hero and About copy were rewritten in past tense for 2U and now point
  at Staff/Senior backend roles in NYC. The resume PDF should be regenerated
  to match (title, LinkedIn slug).
- `README.md` still describes the pre-review file layout in places.
