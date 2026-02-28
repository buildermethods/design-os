# Development Container

This project includes a development container configuration for consistent development environments across different machines.

## Prerequisites

- Docker
- A devcontainer-compatible tool (VS Code Dev Containers, GitHub Codespaces, crib, etc.)

## What's Included

- Node.js 20 with TypeScript support
- Git
- Playwright (chromium) with browser dependencies pre-installed
- npm packages from `package.json` auto-installed on container creation

## Getting Started

### VS Code

1. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension
2. Open the project folder
3. Click the remote indicator (bottom left corner)
4. Select "Reopen in Container"

The container will build and initialize automatically (first build takes ~2-3 minutes).

### Other Tools

Use your devcontainer-compatible tool to open this project. Refer to its documentation for specific instructions.

## Available Commands

Once the container is running:

```bash
npm run dev       # Start Vite dev server (http://localhost:3000)
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Playwright MCP Integration

Playwright (chromium) is pre-installed in the container image. To use it with Claude Code's Playwright MCP integration, run this **inside the container**:

```bash
claude mcp add playwright -- npx @playwright/mcp@latest --headless
```

**NOTE**: The `--headless` flag is required inside the container since there is no display server.
