# SpecChem Design Language (LMS/Ebook Direction)

**Date:** 2025-01-10  
**Purpose:** Business documentation  
**Status:** Complete  
**Audience:** Business Stakeholders  

SpecChem Design Language (LMS/Ebook Direction)

Name: Industrial Knowledge Minimalism
Keywords: professional, legible, modular, confident, modern-industrial
Primary Use: Learning Management System, digital manuals, interactive training content

⸻

1) Brand Mood & Principles
	•	Industrial credibility: visual language rooted in engineered environments (concrete, steel, technical orange).
	•	Long-form optimized: text-forward layouts, comfortable reading widths, subtle hierarchy to guide learners.
	•	No distractions: content is king; UI supports comprehension without visual noise.
	•	Structured navigation: modular progression through lessons, intuitive bookmarking, and visual progress indicators.
	•	Consistent identity: aligns LMS feel with SpecChem’s B2B industrial professionalism.

⸻

2) Design Tokens (Source of Truth)

Defined in tokens.json (and Tailwind theme). Used everywhere: colors, spacing, typography, motion.

{
  "color": {
    "bg": { "base": "#FAFAFA", "elev1": "#FFFFFF", "elev2": "#F5F5F7", "paper": "#FFFFFF" },
    "fg": { "primary": "#0D0F12", "secondary": "#49505A", "muted": "#7A828D", "inverse": "#FFFFFF" },
    "brand": { "primary": "#FF6A00", "primary-600": "#E85F00", "primary-700": "#C65300" },
    "accent": { "cool": "#1976D2", "cool-600": "#135BA8" },
    "state": { "success":"#16A34A","warning":"#F59E0B","error":"#DC2626","info":"#3BA3FF" }
  },
  "font": {
    "sans": "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
    "serif": "Merriweather, Georgia, serif",
    "mono": "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
  },
  "typeScale": { "xs":"0.8125rem","sm":"0.875rem","base":"1rem","lg":"1.125rem","xl":"1.25rem","2xl":"1.5rem","3xl":"2rem","4xl":"2.5rem" },
  "spacing": { "xs":"0.5rem","sm":"0.75rem","md":"1rem","lg":"1.5rem","xl":"2rem","2xl":"3rem" },
  "radius": { "sm":"0.375rem", "md":"0.5rem", "lg":"0.75rem", "xl":"1rem" },
  "shadow": { "sm":"0 1px 2px rgba(0,0,0,0.08)", "md":"0 4px 12px rgba(0,0,0,0.12)", "lg":"0 8px 20px rgba(0,0,0,0.16)" },
  "motion": { "ease":"cubic-bezier(0.2, 0.6, 0.2, 1)", "fast":"150ms", "base":"240ms" },
  "grid": { "contentWidth":"760px", "wide":"1200px" }
}

	•	Dark Mode Variant: background = #0B0C0E + elevated cards #121418, text = #F5F7FA, brand colors unchanged.

⸻

3) Layout System
	•	Content-first: central column width ~680–760px for reading; adaptive margins on wide screens.
	•	Side rail (optional): progress tracker, bookmarks, collapsible table of contents.
	•	Global nav: slim top bar (logo, course selector, user menu); avoids clutter.
	•	Responsive: mobile = stacked content; key actions remain fixed bottom bar if needed.

⸻

4) Typography
	•	Body (default): Inter, 16–18px base for readability.
	•	Headings: Inter semibold; sizes scaled to context:
	•	H1 (page/lesson): 36px
	•	H2 (section): 28px
	•	H3 (subsection): 22px
	•	Long-form text: paragraphs use serif (Merriweather) for reading comfort in lessons.
	•	Code samples: mono font; styled blocks with subtle background #F5F5F7.
	•	Line length: max 72ch; generous leading (1.6 body, 1.3 headings).

⸻

5) Color Application
	•	Background: soft neutral (bg.base) for reading surfaces.
	•	Primary CTAs: brand orange; hover darkens.
	•	Links in content: accent cool blue, underline on hover, no raw brand orange in running text (reserved for CTAs).
	•	Highlight blocks: subtle colored left border (info/success/warning/error) with light tint backgrounds.

⸻

6) Components (Tailwind + shadcn/ui Recipes)
	•	Lesson Card:
rounded-lg bg-[--bg-elev1] shadow-sm p-6 hover:shadow-md transition
	•	Progress Bar:
slim, brand-orange fill; background neutral-200.
	•	Navigation Button:
inline-flex items-center px-4 py-2 rounded-lg bg-[--brand-primary] text-white hover:bg-[--brand-primary-600] transition
	•	Quote/Callout Block:
border-l-4 pl-4 italic text-[--fg-secondary] bg-[--bg-elev2]
	•	Tabs (module switching):
underline active style; smooth fade between tabs.

⸻

7) Interaction & Motion
	•	Page transitions: fade-in of content (150ms), slide progress bar.
	•	Focus states: accessible rings, consistent for keyboard users.
	•	Animations: purposeful (progress fill, tab switch), no gimmicks.

⸻

8) LMS-Specific Elements
	•	Table of Contents (ToC): collapsible, highlights current section, scroll-sync.
	•	Bookmarks: quick jump to marked lessons.
	•	Notes panel: sticky sidebar on desktop; bottom sheet mobile.
	•	Quiz blocks: carded questions, success/error states clearly marked.
	•	Completion tracking: persistent badge per lesson/module.

⸻

9) Accessibility
	•	Color contrast: WCAG AA+ for all instructional content.
	•	ARIA landmarks: <main>, <nav>, <aside> for screen readers.
	•	Skip-to-content links: always available.
	•	Keyboard navigation: full course nav usable via tab/enter/space.

⸻

10) Why This Fits SpecChem
	•	Industrial aesthetic remains: grounded, precise, and not “consumer-trendy.”
	•	Supports technical training: readability-first typography and clear structure mirrors engineering docs.
	•	Consistent with CRM: uses same brand palette and modern UI language, but adapts for learning contexts.
	•	Scales: from simple PDF-like reading to interactive multimedia courses.

⸻

11) Implementation Notes for the Agent
	•	Always use theme tokens. Never hardcode colors or sizes.
	•	Leverage shadcn/ui primitives (Tabs, Accordion, Dialog, Toast). Style via tokens.
	•	Ensure content types (video, quiz, pdf embeds) have uniform frames.
	•	Use markdown-friendly styling for rich text content.
	•	Validate mobile and offline-friendly reading (caching, progressive loading).