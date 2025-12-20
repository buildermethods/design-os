# Design OS Plugin Marketplace

Welcome to the Design OS Plugin Marketplace for Claude Code! This marketplace provides easy access to Design OS's powerful product planning and design workflow directly within Claude Code.

## About Design OS

Design OS is the missing design process between your idea and your codebase. It's a product planning and design tool that helps you define your product vision, structure your data model, design your UI, and export production-ready components for implementation.

Rather than jumping straight into code, you work through a guided process that captures what you're building and why—then hands off everything your coding agent needs to build it right.

## Available Plugins

### 🎯 design-os
The complete Design OS workflow bundle that includes all features:
- Product planning and vision definition
- Design system setup
- Section design and UI mockups
- Production-ready component export

**Installation**: `/plugin install design-os@buildermethods`

### 📋 product-vision
Define your product vision, roadmap, and data model with AI-guided planning.

**Commands**:
- `/product-vision` - Define your product vision and objectives
- `/product-roadmap` - Create a structured product roadmap
- `/data-model` - Model your application's data structure

**Installation**: `/plugin install product-vision@buildermethods`

### 🎨 design-system
Design your complete design system with tokens, colors, typography, and application shell.

**Commands**:
- `/design-tokens` - Define colors, typography, spacing, and design tokens
- `/design-shell` - Design your application shell and layout components

**Installation**: `/plugin install design-system@buildermethods`

### 🖼️ section-designer
Design individual sections with requirements, sample data, and screen designs.

**Commands**:
- `/shape-section` - Define a new application section
- `/sample-data` - Generate realistic sample data for your section
- `/design-screen` - Design the UI for your section
- `/screenshot-design` - Take and reference design screenshots

**Installation**: `/plugin install section-designer@buildermethods`

### 📦 exporter
Export production-ready React components and implementation guides.

**Commands**:
- `/export-product` - Generate the complete handoff package for developers

**Installation**: `/plugin install exporter@buildermethods`

## Installation

### Quick Start

1. **Add the marketplace**:
   ```bash
   /plugin marketplace add https://github.com/briancasel/design-os
   ```

2. **Install plugins**:
   ```bash
   # Install the complete workflow
   /plugin install design-os@buildermethods

   # Or install individual plugins
   /plugin install product-vision@buildermethods
   /plugin install design-system@buildermethods
   /plugin install section-designer@buildermethods
   /plugin install exporter@buildermethods
   ```

### Local Development

If you're developing the marketplace locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/briancasel/design-os.git
   cd design-os
   ```

2. **Add local marketplace**:
   ```bash
   /plugin marketplace add ./design-os-marketplace
   ```

3. **Install plugins**:
   ```bash
   /plugin install design-os@buildermethods
   ```

## Usage Workflow

### 1. Start with Product Vision
```bash
/product-vision
```
Define your product's core purpose, target users, and key objectives.

### 2. Create a Roadmap
```bash
/product-roadmap
```
Break down your vision into actionable phases and features.

### 3. Define Your Data Model
```bash
/data-model
```
Model your application's data structure and relationships.

### 4. Set Up Your Design System
```bash
/design-tokens
/design-shell
```
Define colors, typography, and design your application shell.

### 5. Design Each Section
```bash
/shape-section
/sample-data
/design-screen
```
Design individual feature sections with sample data and UI mockups.

### 6. Export for Implementation
```bash
/export-product
```
Generate production-ready React components and documentation.

## Support

- **Official Documentation**: [buildermethods.com/design-os](https://buildermethods.com/design-os)
- **Community**: Join [Builder Methods Pro](https://buildermethods.com/pro) for direct support
- **Issues**: Report issues on [GitHub](https://github.com/briancasel/design-os/issues)

## License

MIT License - see [LICENSE](https://github.com/briancasel/design-os/blob/main/LICENSE) file for details.

## Created by Brian Casel

Built by Brian Casel, creator of [Builder Methods](https://buildermethods.com).

- **Newsletter**: [Builder Briefing](https://buildermethods.com)
- **YouTube**: [Brian Casel](https://youtube.com/@briancasel)
- **Twitter**: [@briancasel](https://twitter.com/briancasel)