/**
 * Product data loading and markdown parsing utilities
 * Uses dynamic fetch() for hot-reloading support in development
 */

import type { ProductOverview, ProductRoadmap, Problem, Section, ProductData } from '@/types/product'
import { loadDataModel } from './data-model-loader'
import { loadDesignSystem } from './design-system-loader'
import { loadShellInfo } from './shell-loader'

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

  // Normalize line endings (Windows \r\n -> Unix \n)
  const content = md.replace(/\r\n/g, '\n')

  try {
    // Extract product name from first # heading
    const nameMatch = content.match(/^#\s+(.+)$/m)
    const name = nameMatch?.[1]?.trim() || 'Product Overview'

    // Extract description - content between ## Description and next ##
    const descMatch = content.match(/## Description\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const description = descMatch?.[1]?.trim() || ''

    // Extract problems - ### Problem N: Title pattern
    const problemsSection = content.match(/## Problems & Solutions\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
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
    const featuresSection = content.match(/## Key Features\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
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

  // Normalize line endings (Windows \r\n -> Unix \n)
  const content = md.replace(/\r\n/g, '\n')

  try {
    const sections: Section[] = []

    // Match sections with pattern ### N. Title
    const sectionMatches = [...content.matchAll(/### (\d+)\.\s*(.+)\n+([\s\S]*?)(?=\n### |\n## |\n#[^#]|$)/g)]

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
 * Fetch a text file with cache busting for development
 */
async function fetchText(path: string): Promise<string | null> {
  try {
    const cacheBuster = import.meta.env.DEV ? `?t=${Date.now()}` : ''
    const response = await fetch(`${path}${cacheBuster}`)
    if (!response.ok) return null
    return await response.text()
  } catch {
    return null
  }
}

/**
 * Load product overview from markdown file (async)
 */
export async function fetchProductOverview(): Promise<ProductOverview | null> {
  const content = await fetchText('/product/product-overview.md')
  return content ? parseProductOverview(content) : null
}

/**
 * Load product roadmap from markdown file (async)
 */
export async function fetchProductRoadmap(): Promise<ProductRoadmap | null> {
  const content = await fetchText('/product/product-roadmap.md')
  return content ? parseProductRoadmap(content) : null
}

/**
 * Load all product data from files (async)
 */
export async function fetchProductData(): Promise<ProductData> {
  const [overview, roadmap, dataModel, designSystem, shell] = await Promise.all([
    fetchProductOverview(),
    fetchProductRoadmap(),
    loadDataModel(),
    loadDesignSystem(),
    loadShellInfo(),
  ])

  return {
    overview,
    roadmap,
    dataModel,
    designSystem,
    shell,
  }
}

/**
 * Check if product overview exists (async)
 */
export async function hasProductOverview(): Promise<boolean> {
  const overview = await fetchProductOverview()
  return overview !== null
}

/**
 * Check if product roadmap exists (async)
 */
export async function hasProductRoadmap(): Promise<boolean> {
  const roadmap = await fetchProductRoadmap()
  return roadmap !== null
}

// Load zip files from root directory at build time (must remain sync for now)
const exportZipFiles = import.meta.glob('/product-plan.zip', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

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
