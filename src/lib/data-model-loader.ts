/**
 * Data model loading and parsing utilities
 */

import type { DataModel, Entity } from '@/types/product'

// Load data model markdown file at build time
const dataModelFiles = import.meta.glob('/product/data-model/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Parse data-model.md content into DataModel structure
 *
 * Expected format:
 * # Data Model
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
export function parseDataModel(md: string): DataModel | null {
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
 * Load the data model from markdown file
 */
export function loadDataModel(): DataModel | null {
  const content = dataModelFiles['/product/data-model/data-model.md']
  return content ? parseDataModel(content) : null
}

/**
 * Check if data model has been defined
 */
export function hasDataModel(): boolean {
  return '/product/data-model/data-model.md' in dataModelFiles
}
