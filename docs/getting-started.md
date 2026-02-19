# Getting Started

## Clone the Repository

```bash
git clone https://github.com/buildermethods/design-os.git my-project-design
cd my-project-design
```

Replace `my-project-design` with whatever you want to name your design workspace.

## Remove the Original Remote

```bash
git remote remove origin
```

Now you have a clean local instance ready to use.

## Install Dependencies

```bash
npm install
```

## Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Open Claude Code

In the same project directory, start Claude Code:

```bash
claude
```

You're ready to start designing. Run `/product-vision` to begin defining your product.

---

## Optional: Save as Your Own Template

If you want to reuse Design OS for future projects:

1. Push to your own GitHub repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

2. Go to your repository on GitHub, click **Settings**, and check **Template repository**.

Now you can create new instances using GitHub's "Use this template" button.
