/**
 * Tech Stack & Architecture data loading utilities
 */

import type { TechStack, TechChoice, ArchitectureLayer } from '@/types/product'

// Load tech stack files from /product/tech-stack/ directory at build time
const techStackFiles = import.meta.glob('/product/tech-stack/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Parse tech-stack.md content into TechStack structure
 *
 * Expected format:
 * # Tech Stack & Architecture
 *
 * ## Technology Choices
 *
 * ### [Category]
 * **Choice:** [Technology]
 * **Rationale:** [Why this choice]
 *
 * ## Architecture
 *
 * ### [Layer Name]
 * [Description]
 * - Component 1
 * - Component 2
 *
 * ## Architecture Diagram
 * ```
 * [ASCII or text diagram]
 * ```
 */
export function parseTechStack(md: string): TechStack | null {
  if (!md || !md.trim()) return null

  try {
    const choices: TechChoice[] = []
    const architecture: ArchitectureLayer[] = []
    let diagram = ''

    // Extract Technology Choices section
    const choicesSection = md.match(/## Technology Choices\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    if (choicesSection?.[1]) {
      const choiceMatches = [...choicesSection[1].matchAll(/### (.+)\n+([\s\S]*?)(?=\n### |\n## |$)/g)]
      for (const match of choiceMatches) {
        const category = match[1].trim()
        const body = match[2].trim()
        const choiceMatch = body.match(/\*\*Choice:\*\*\s*(.+)/)
        const rationaleMatch = body.match(/\*\*Rationale:\*\*\s*(.+)/)
        choices.push({
          category,
          choice: choiceMatch?.[1]?.trim() || '',
          rationale: rationaleMatch?.[1]?.trim() || '',
        })
      }
    }

    // Extract Architecture section
    const archSection = md.match(/## Architecture\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    if (archSection?.[1]) {
      const layerMatches = [...archSection[1].matchAll(/### (.+)\n+([\s\S]*?)(?=\n### |\n## |$)/g)]
      for (const match of layerMatches) {
        const name = match[1].trim()
        const body = match[2].trim()
        const lines = body.split('\n')
        const description = lines[0]?.trim() || ''
        const components: string[] = []
        for (const line of lines.slice(1)) {
          const trimmed = line.trim()
          if (trimmed.startsWith('- ')) {
            components.push(trimmed.slice(2).trim())
          }
        }
        architecture.push({ name, description, components })
      }
    }

    // Extract Architecture Diagram
    const diagramMatch = md.match(/## Architecture Diagram\s*\n+```[\s\S]*?\n([\s\S]*?)```/)
    if (diagramMatch?.[1]) {
      diagram = diagramMatch[1].trim()
    }

    if (choices.length === 0 && architecture.length === 0) {
      return null
    }

    return { choices, architecture, diagram }
  } catch {
    return null
  }
}

/**
 * Load tech stack data
 */
export function loadTechStack(): TechStack | null {
  const content = techStackFiles['/product/tech-stack/tech-stack.md']
  return content ? parseTechStack(content) : null
}

/**
 * Check if tech stack has been defined
 */
export function hasTechStack(): boolean {
  return '/product/tech-stack/tech-stack.md' in techStackFiles
}
