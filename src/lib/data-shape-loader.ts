/**
 * Data shape loading and parsing utilities
 */

import type { DataShape, Entity } from '@/types/product'

// Load data shape markdown file at build time
const dataShapeFiles = import.meta.glob('/product/data-shape/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Parse data-shape.md content into DataShape structure
 *
 * Expected format:
 * # Data Shape
 *
 * ## Entities
 *
 * ### EntityName
 * Description of what this entity represents.
 *
 * ### AnotherEntity
 * Description of this entity.
 *
 * ## Relationships
 *
 * - Entity has many OtherEntity
 * - OtherEntity belongs to Entity
 */
export function parseDataShape(md: string): DataShape | null {
  if (!md || !md.trim()) return null

  try {
    const entities: Entity[] = []
    const relationships: string[] = []

    // Extract entities section
    const entitiesSection = md.match(/## Entities\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)

    if (entitiesSection?.[1]) {
      // Match ### EntityName followed by description
      const entityMatches = [...entitiesSection[1].matchAll(/### ([^\n]+)\n+([\s\S]*?)(?=\n### |\n## |$)/g)]
      for (const match of entityMatches) {
        entities.push({
          name: match[1].trim(),
          description: match[2].trim(),
        })
      }
    }

    // Extract relationships section
    const relationshipsSection = md.match(/## Relationships\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)

    if (relationshipsSection?.[1]) {
      const lines = relationshipsSection[1].split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          relationships.push(trimmed.slice(2).trim())
        }
      }
    }

    // Return null if we couldn't parse anything meaningful
    if (entities.length === 0 && relationships.length === 0) {
      return null
    }

    return { entities, relationships }
  } catch {
    return null
  }
}

/**
 * Load the data shape from markdown file
 */
export function loadDataShape(): DataShape | null {
  const content = dataShapeFiles['/product/data-shape/data-shape.md']
  return content ? parseDataShape(content) : null
}

/**
 * Check if data shape has been defined
 */
export function hasDataShape(): boolean {
  return '/product/data-shape/data-shape.md' in dataShapeFiles
}
