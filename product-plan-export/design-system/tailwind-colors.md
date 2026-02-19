# Tailwind Color Configuration

## Color Choices

- **Primary:** `indigo` — Used for buttons, links, active states, key accents
- **Secondary:** `amber` — Used for tags, highlights, hot lead indicators, warnings
- **Neutral:** `slate` — Used for backgrounds, text, borders, subtle elements

## Usage Examples

### Primary (Indigo)

```html
<!-- Primary button -->
<button class="bg-indigo-600 hover:bg-indigo-700 text-white">
  Save Changes
</button>

<!-- Primary link -->
<a class="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
  View details
</a>

<!-- Active nav item -->
<div class="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
  Today
</div>
```

### Secondary (Amber)

```html
<!-- Hot lead badge -->
<span class="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
  Hot
</span>

<!-- Warning message -->
<div class="border-amber-200 bg-amber-50 text-amber-800">
  Follow-up overdue
</div>

<!-- Score indicator -->
<span class="text-amber-600 dark:text-amber-400">
  Score: 85
</span>
```

### Neutral (Slate)

```html
<!-- Page background -->
<div class="bg-slate-50 dark:bg-slate-900">

<!-- Card -->
<div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">

<!-- Body text -->
<p class="text-slate-600 dark:text-slate-400">
  Lead details
</p>

<!-- Muted text -->
<span class="text-slate-500 dark:text-slate-500">
  Last contacted 2 days ago
</span>

<!-- Divider -->
<hr class="border-slate-200 dark:border-slate-700" />
```

## Stage Colors

Different stages use distinct colors for quick visual scanning:

| Stage | Color | Usage |
|-------|-------|-------|
| New | `slate` | Default/neutral state |
| Contacted | `blue` | Progress indicator |
| Hot | `amber` | Attention/priority |
| Demo Scheduled | `indigo` | Primary action |
| Won | `emerald` | Success |
| Lost | `rose` | Failure/drop |

```html
<!-- Stage badges -->
<span class="bg-slate-100 text-slate-700">New</span>
<span class="bg-blue-100 text-blue-700">Contacted</span>
<span class="bg-amber-100 text-amber-800">Hot</span>
<span class="bg-indigo-100 text-indigo-700">Demo Scheduled</span>
<span class="bg-emerald-100 text-emerald-700">Won</span>
<span class="bg-rose-100 text-rose-700">Lost</span>
```

## Dark Mode

All color utilities have dark mode variants. Use the `dark:` prefix:

```html
<div class="bg-white dark:bg-slate-800">
  <h2 class="text-slate-900 dark:text-slate-100">Title</h2>
  <p class="text-slate-600 dark:text-slate-400">Description</p>
</div>
```
