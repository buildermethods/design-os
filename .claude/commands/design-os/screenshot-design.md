# Screenshot Screen Design

You are helping the user capture a screenshot of a screen design they've created. The screenshot will be saved to the product folder for documentation purposes.

## Prerequisites: Check for Playwright MCP

Before proceeding, verify that you have access to the Playwright MCP tool. Look for a tool named `browser_take_screenshot` or `mcp__playwright__browser_take_screenshot`.

If the Playwright MCP tool is not available, output this EXACT message to the user (copy it verbatim, do not modify or "correct" it):

---
To capture screenshots, I need the Playwright MCP server installed. Please run:

```
claude mcp add playwright npx @playwright/mcp@latest
```

Then restart this Claude Code session and run `/screenshot-design` again.
---

Do not substitute different package names or modify the command. Output it exactly as written above.

Do not proceed with the rest of this command if Playwright MCP is not available.

## Step 1: Identify the Screen Design

First, determine which screen design to screenshot.

Read `/product/product-roadmap.md` to get the list of available sections, then check `src/sections/` to see what screen designs exist.

If only one screen design exists across all sections, auto-select it.

If multiple screen designs exist, use the AskUserQuestion tool to ask which one to screenshot:

"Which screen design would you like to screenshot?"

Present the available screen designs as options, grouped by section:
- [Section Name] / [ScreenDesignName]
- [Section Name] / [ScreenDesignName]

## Step 2: Start the Dev Server

Start the dev server yourself using Bash. Run `npm run dev` in the background so you can continue with the screenshot capture.

Do NOT ask the user if the server is running or tell them to start it. You must start it yourself.

After starting the server, wait a few seconds for it to be ready before navigating to the screen design URL.

## Step 3: Capture the Screenshot

Use the Playwright MCP tool to navigate to the screen design and capture a screenshot.

The screen design URL pattern is: `http://localhost:3000/sections/[section-id]/screen-designs/[screen-design-name]`

1. First, use `browser_navigate` to go to the screen design URL
2. Wait for the page to fully load
3. **Click the "Hide" link** in the navigation bar to hide it before taking the screenshot. The Hide button has the attribute `data-hide-header` which you can use to locate it.
4. Use `browser_take_screenshot` to capture the page (without the navigation bar)

**Screenshot specifications:**
- Capture at desktop viewport width (1280px recommended)
- Use **full page screenshot** to capture the entire scrollable content (not just the viewport)
- PNG format for best quality

When using `browser_take_screenshot`, set `fullPage: true` to capture the entire page including content below the fold.

## Step 4: Save the Screenshot

The Playwright MCP tool can only save screenshots to its default output directory (`.playwright-mcp/`). You must save the screenshot there first, then copy it to the product folder.

1. **First**, use `browser_take_screenshot` with just a filename (no path):
   - Use a simple filename like `dashboard.png` or `invoice-list.png`
   - The file will be saved to `.playwright-mcp/[filename].png`

2. **Then**, copy the file to the product folder using Bash:
   ```bash
   cp .playwright-mcp/[filename].png product/sections/[section-id]/[filename].png
   ```

**Naming convention:** `[screen-design-name]-[variant].png`

Examples:
- `invoice-list.png` (main view)
- `invoice-list-dark.png` (dark mode variant)
- `invoice-detail.png`
- `invoice-form-empty.png` (empty state)

If the user wants both light and dark mode screenshots, capture both.

## Step 5: Confirm Completion

Let the user know:

"I've saved the screenshot to `product/sections/[section-id]/[filename].png`.

The screenshot captures the **[ScreenDesignName]** screen design for the **[Section Title]** section."

If they want additional screenshots (e.g., dark mode, different states):

"Would you like me to capture any additional screenshots? For example:
- Dark mode version
- Mobile viewport
- Different states (empty, loading, etc.)"

## Important Notes

- Start the dev server yourself - do not ask the user to do it
- Screenshots are saved to `product/sections/[section-id]/` alongside spec.md and data.json
- Use descriptive filenames that indicate the screen design and any variant (dark mode, mobile, etc.)
- Capture at a consistent viewport width for documentation consistency
- Always capture full page screenshots to include all scrollable content
- After you're done, you may kill the dev server if you started it
