# What is Design OS?

Design OS is the missing step between your product idea and your codebase.

It's a product planning and design tool that helps you define your product vision, structure your data model, design your UI, and export production-ready components for implementation. Rather than jumping straight into code, you work through a guided process that captures what you're building and why—then hands off everything your coding agent needs to build it right.

## The Problem

AI coding tools are incredible at building fast. But the results often miss the mark. You describe what you want, the agent builds *something*, but it's not what you envisioned. The UI looks generic. Features get half-implemented. You spend as much time fixing and redirecting as you would have spent building.

The core issue: we're asking coding agents to figure out what to build *and* build it simultaneously. Design decisions get made on the fly, buried in code, impossible to adjust without starting over. There's no spec. No shared understanding. No source of truth for what "done" looks like.

## The Design OS Process

Design OS powers a guided design and architecture process. You + AI, working together through structured steps:

1. **Product Planning** — Define your vision, break down your roadmap, and model your data
2. **Design System** — Choose colors, typography, and design your application shell
3. **Section Design** — For each feature area: specify requirements, generate sample data, and design the screens
4. **Export** — Generate a complete handoff package for implementation

Each step is a conversation. The AI asks questions, you provide direction, and together you shape a product that matches your vision—before any implementation begins.

## How It Works

Design OS is its own separate codebase—a design environment you use *before* building. When you're done, you export components and assets to import into your actual product's codebase.

You interact with Design OS through slash commands. Each command walks you through a specific part of the process:

- `/product-vision` — Define what you're building and why
- `/product-roadmap` — Break your product into buildable sections
- `/data-model` — Define the core entities in your system
- `/design-tokens` — Choose your color palette and typography
- `/design-shell` — Design navigation and layout
- `/shape-section` — Specify a section's scope and requirements
- `/sample-data` — Generate realistic data for screen designs
- `/design-screen` — Create production-ready React components
- `/screenahot-design` — Snap a screenshot of a finished design screen for quick reference
- `/export-product` — Generate the complete handoff package

See [Usage](usage.md) for the full workflow.

## Who It's For

- **Technical builders** — Full control over architecture and design decisions without doing all the legwork yourself.
- **Non-technical product builders** — A strong vision for how your product should work, plus the ability to put your imprint on its systems—no technical background required.

## Compatibility

- Works with any AI coding agent: Claude Code, Cursor, Copilot, or anything that can implement from a handoff
- Your frontend needs React and Tailwind CSS
- Your backend can be anything—Rails, Laravel, Next.js, Python, whatever

## Open Source

Design OS is free, open source, and runs locally.
