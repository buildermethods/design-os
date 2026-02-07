# Figma Integration

You are helping the user link their Figma design files to their Design OS project. This creates a bridge between the design tool and the product planning workflow.

## Step 1: Check Prerequisites

First, verify that the design system exists:

Read `/product/design-system/colors.json` or `/product/design-system/typography.json` to check if the design system has been set up.

If neither exists:

"Before linking Figma files, I'd recommend setting up your design tokens first with `/design-tokens`. This ensures your Figma designs align with the chosen color palette and typography.

Would you like to proceed anyway, or run `/design-tokens` first?"

Use AskUserQuestion to let the user choose. Proceed if they want to continue.

## Step 2: Gather Figma Links

"Let's connect your Figma files to **[Product Name]** (or 'your project' if no product overview exists).

I'll need:
1. **Main Figma file URL** — The primary design file for your product
2. **Embed URL** (optional) — For an embedded preview in Design OS
3. **Additional links** (optional) — Prototypes, component libraries, etc.

Please share your main Figma file URL. It should look like:
`https://www.figma.com/design/[file-id]/[file-name]`"

Wait for the user to provide their Figma URL.

## Step 3: Validate and Process URLs

When the user provides a URL, validate it:

- It should start with `https://www.figma.com/` or `https://figma.com/`
- Common formats:
  - Design file: `https://www.figma.com/design/[id]/[name]`
  - Prototype: `https://www.figma.com/proto/[id]/[name]`
  - Board/FigJam: `https://www.figma.com/board/[id]/[name]`
  - File (legacy): `https://www.figma.com/file/[id]/[name]`

If the URL doesn't look like a Figma URL, ask for clarification.

## Step 4: Generate Embed URL

Create the embed URL from the file URL:

The Figma embed format is:
`https://www.figma.com/embed?embed_host=share&url=[encoded-file-url]`

Let the user know:

"I'll set up an embedded preview so you can view the design directly in Design OS.

Do you have any additional Figma links to add? For example:
- A clickable **prototype**
- A **component library** or design system file
- Specific **frames** or pages to reference

If not, we'll just use the main file."

Use AskUserQuestion to gather additional links.

## Step 5: Classify Links

For each link provided, determine the type:

- URLs containing `/proto/` → type: `prototype`
- URLs containing `/board/` → type: `board`
- URLs with `node-id=` parameter → type: `frame`
- All other Figma URLs → type: `file`

## Step 6: Ask About Access Token (Optional)

"Do you have a Figma personal access token for API integration? This is optional and enables features like:
- Fetching file metadata
- Syncing component lists
- Pulling design tokens directly from Figma

If you don't have one, that's fine — the links and embedded preview will still work.

You can generate a token at: Figma → Settings → Personal access tokens"

Use AskUserQuestion with options:
- "I have an access token" — Ask them to provide it
- "Skip for now" — Leave accessToken empty

**Important:** If they provide a token, remind them to keep it secure and not commit it to public repositories.

## Step 7: Present Configuration and Confirm

"Here's your Figma integration setup:

**Main File:** [URL]
**Embedded Preview:** Enabled
**Linked Files:**
- [Label] — [Type] — [URL]
- [Label] — [Type] — [URL]
**Access Token:** [Configured / Not configured]

Ready to save?"

## Step 8: Create the File

Once approved, create the file at `/product/design-system/figma.json` with this format:

```json
{
  "fileUrl": "[main-figma-file-url]",
  "embedUrl": "https://www.figma.com/embed?embed_host=share&url=[encoded-file-url]",
  "accessToken": "",
  "links": [
    {
      "label": "[Descriptive Label]",
      "url": "[figma-url]",
      "type": "[file|prototype|board|frame]"
    }
  ]
}
```

**Notes:**
- The main file URL should always be included in the `links` array as well
- Labels should be descriptive (e.g., "Main Design File", "Interactive Prototype", "Component Library")
- `embedUrl` should URL-encode the file URL in the query parameter
- `accessToken` should be an empty string if not provided — never store placeholder values

## Step 9: Confirm Completion

Let the user know:

"I've set up the Figma integration at `/product/design-system/figma.json`.

**What's configured:**
- Embedded preview in the Design tab
- [N] linked Figma files
- Quick-access links to open files directly in Figma

You can view the integration on the Design page in Design OS. The embedded preview will appear in the Figma Integration step.

To update links or add more files, edit `product/design-system/figma.json` directly or run `/figma` again."

## Important Notes

- Always validate that URLs are actual Figma URLs before saving
- The embed URL must use URL encoding for the file URL parameter
- Never store sensitive tokens in plain text suggestions — warn the user about security
- Include the main file in the links array so it appears in the linked files list
- Labels should be user-friendly, not raw URLs
- If the user has multiple Figma files (design + prototype), include all of them
- The `accessToken` field is for future API integration — leave empty if not provided
