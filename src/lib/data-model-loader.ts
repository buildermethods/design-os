/**
 * Data model loading and parsing utilities
 * Uses dynamic fetch() for hot-reloading support in development
 */

import type { DataModel, Entity } from '@/types/product'

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

  // Normalize line endings (Windows \r\n -> Unix \n)
  const content = md.replace(/\r\n/g, '\n')

  try {
    const entities: Entity[] = []
    const relationships: string[] = []

    // Extract entities section
    const entitiesSection = content.match(/## Entities\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)

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
    const relationshipsSection = content.match(/## Relationships\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)

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
 * Load the data model from markdown file (async)
 */
export async function loadDataModel(): Promise<DataModel | null> {
  const content = await fetchText('/product/data-model/data-model.md')
  return content ? parseDataModel(content) : null
}

/**
 * Check if data model has been defined (async)
 */
export async function hasDataModel(): Promise<boolean> {
  const dataModel = await loadDataModel()
  return dataModel !== null
}
