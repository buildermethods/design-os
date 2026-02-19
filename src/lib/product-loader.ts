/**
 * Product data loading and markdown parsing utilities
 */

import type { ProductOverview, ProductRoadmap, Problem, Section, ProductData } from '@/types/product'
import { loadDataModel, hasDataModel } from './data-model-loader'
import { loadDesignSystem, hasDesignSystem } from './design-system-loader'
import { loadShellInfo, hasShell } from './shell-loader'

// Load markdown files from /product/ directory at build time
const productFiles = import.meta.glob('/product/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Load zip files from root directory at build time
const exportZipFiles = import.meta.glob('/product-plan.zip', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Slugify a string for use as an ID
 * Converts " & " to "-and-" to maintain semantic meaning
 */
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+&\s+/g, '-and-') // Convert " & " to "-and-" first
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Parse product-overview.md content into ProductOverview structure
 *
 * Expected format:
 * # [Product Name]
 *
 * ## Description
 * [1-3 sentence product description]
 *
 * ## Problems & Solutions
 *
 * ### Problem 1: [Problem Title]
 * [How the product solves it]
 *
 * ## Key Features
 * - Feature 1
 * - Feature 2
 */
export function parseProductOverview(md: string): ProductOverview | null {
  if (!md || !md.trim()) return null

  try {
    // Extract product name from first # heading
    const nameMatch = md.match(/^#\s+(.+)$/m)
    const name = nameMatch?.[1]?.trim() || 'Product Overview'

    // Extract description - content between ## Description and next ##
    const descMatch = md.match(/## Description\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const description = descMatch?.[1]?.trim() || ''

    // Extract problems - ### Problem N: Title pattern
    const problemsSection = md.match(/## Problems & Solutions\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const problems: Problem[] = []

    if (problemsSection?.[1]) {
      const problemMatches = [...problemsSection[1].matchAll(/### Problem \d+:\s*(.+)\n+([\s\S]*?)(?=\n### |\n## |$)/g)]
      for (const match of problemMatches) {
        problems.push({
          title: match[1].trim(),
          solution: match[2].trim(),
        })
      }
    }

    // Extract features - bullet list after ## Key Features
    const featuresSection = md.match(/## Key Features\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const features: string[] = []

    if (featuresSection?.[1]) {
      const lines = featuresSection[1].split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          features.push(trimmed.slice(2).trim())
        }
      }
    }

    // Return null if we couldn't parse anything meaningful
    if (!description && problems.length === 0 && features.length === 0) {
      return null
    }

    return { name, description, problems, features }
  } catch {
    return null
  }
}

/**
 * Parse product-roadmap.md content into ProductRoadmap structure
 *
 * Expected format:
 * # Product Roadmap
 *
 * ## Sections
 *
 * ### 1. [Section Title]
 * [One sentence description]
 *
 * ### 2. [Section Title]
 * [One sentence description]
 */
export function parseProductRoadmap(md: string): ProductRoadmap | null {
  if (!md || !md.trim()) return null

  try {
    const sections: Section[] = []

    // Match sections with pattern ### N. Title
    const sectionMatches = [...md.matchAll(/### (\d+)\.\s*(.+)\n+([\s\S]*?)(?=\n### |\n## |\n#[^#]|$)/g)]

    for (const match of sectionMatches) {
      const order = parseInt(match[1], 10)
      const title = match[2].trim()
      const description = match[3].trim()

      sections.push({
        id: slugify(title),
        title,
        description,
        order,
      })
    }

    // Sort by order
    sections.sort((a, b) => a.order - b.order)

    if (sections.length === 0) {
      return null
    }

    return { sections }
  } catch {
    return null
  }
}

/**
 * Load all product data from markdown files and other sources
 */
export function loadProductData(): ProductData {
  const overviewContent = productFiles['/product/product-overview.md']
  const roadmapContent = productFiles['/product/product-roadmap.md']

  return {
    overview: overviewContent ? parseProductOverview(overviewContent) : null,
    roadmap: roadmapContent ? parseProductRoadmap(roadmapContent) : null,
    dataModel: loadDataModel(),
    designSystem: loadDesignSystem(),
    shell: loadShellInfo(),
  }
}

/**
 * Check if product overview has been defined
 */
export function hasProductOverview(): boolean {
  return '/product/product-overview.md' in productFiles
}

/**
 * Check if product roadmap has been defined
 */
export function hasProductRoadmap(): boolean {
  return '/product/product-roadmap.md' in productFiles
}

/**
 * Check if export zip file exists
 */
export function hasExportZip(): boolean {
  return '/product-plan.zip' in exportZipFiles
}

/**
 * Get the URL of the export zip file (if it exists)
 */
export function getExportZipUrl(): string | null {
  return exportZipFiles['/product-plan.zip'] || null
}

// Re-export utility functions for checking individual pieces
export { hasDataModel, hasDesignSystem, hasShell }
