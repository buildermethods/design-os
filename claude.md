Refer to @agents.md

# IMPORTANT: Directory Structure
# Root `./` = Design OS (planning tool). `./cadence-app/` = Cadence app (the product). All dev work goes in cadence-app/.

# Design OS Commands

When the user invokes any of these commands (with `/` or by name), read and execute the corresponding instruction file:

## Workflow Sequence
1. `/product-vision` → `.claude/commands/design-os/product-vision.md`
2. `/product-roadmap` → `.claude/commands/design-os/product-roadmap.md`
3. `/data-model` → `.claude/commands/design-os/data-model.md`
4. `/design-tokens` → `.claude/commands/design-os/design-tokens.md`
5. `/design-shell` → `.claude/commands/design-os/design-shell.md`
6. Per section:
   - `/shape-section` → `.claude/commands/design-os/shape-section.md`
   - `/sample-data` → `.claude/commands/design-os/sample-data.md`
   - `/design-screen` → `.claude/commands/design-os/design-screen.md`
   - `/screenshot-design` → `.claude/commands/design-os/screenshot-design.md`
7. `/export-product` → `.claude/commands/design-os/export-product.md`

## How to Invoke
Say `/product-vision`, "run product-vision", or "start the design OS workflow" and I'll read and follow the corresponding command file.

## Chaining
Each command file contains "Next steps" that reference the next command in the workflow. Follow those instructions to guide the user through the complete flow.
