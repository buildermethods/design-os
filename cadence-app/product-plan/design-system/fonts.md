# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Or import in CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

## Font Usage

| Purpose | Font | Weights |
|---------|------|---------|
| Headings | Inter | 600 (semibold), 700 (bold) |
| Body text | Inter | 400 (regular), 500 (medium) |
| Code/technical | JetBrains Mono | 400 (regular), 500 (medium) |

## Tailwind CSS v4 Setup

Use CSS variables with Tailwind v4 `@theme`:

```css
@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

## Typography Scale

Use Tailwind's built-in text utilities:

```html
<!-- Page title -->
<h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>

<!-- Section heading -->
<h2 class="text-lg font-semibold text-slate-800">Today's Follow-ups</h2>

<!-- Card title -->
<h3 class="text-base font-medium text-slate-700">Lead Details</h3>

<!-- Body text -->
<p class="text-sm text-slate-600">Last contacted 2 days ago</p>

<!-- Small/muted text -->
<span class="text-xs text-slate-500">Created Jan 10, 2024</span>

<!-- Code/technical -->
<code class="font-mono text-sm">lead-001</code>
```

## Recommended Sizes

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title | `text-2xl` | `font-bold` | `text-slate-900` |
| Section heading | `text-lg` | `font-semibold` | `text-slate-800` |
| Card/panel title | `text-base` | `font-medium` | `text-slate-700` |
| Body text | `text-sm` | `font-normal` | `text-slate-600` |
| Labels | `text-sm` | `font-medium` | `text-slate-700` |
| Helper text | `text-xs` | `font-normal` | `text-slate-500` |
| Badges/chips | `text-xs` | `font-medium` | varies |
