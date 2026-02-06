/**
 * Cost Estimator & Optimizer data loading utilities
 */

import type { CostEstimate, CostTier, CostLineItem } from '@/types/product'

// Load cost estimator files from /product/cost-estimator/ directory at build time
const costFiles = import.meta.glob('/product/cost-estimator/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Parse cost-estimate.md content into CostEstimate structure
 *
 * Expected format:
 * # Cost Estimate
 *
 * ## [Tier Name] ([User Count])
 *
 * | Category | Item | Monthly Cost | Notes |
 * |----------|------|-------------|-------|
 * | Hosting  | AWS  | $50         | ...   |
 *
 * ## Optimizations
 * - Optimization 1
 * - Optimization 2
 */
export function parseCostEstimate(md: string): CostEstimate | null {
  if (!md || !md.trim()) return null

  try {
    const tiers: CostTier[] = []
    const optimizations: string[] = []

    // Extract tiers - ## Tier Name (user count)
    const tierMatches = [...md.matchAll(/## (.+?)\s*\((.+?)\)\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/g)]
    for (const match of tierMatches) {
      const name = match[1].trim()
      const users = match[2].trim()
      const body = match[3].trim()
      const items: CostLineItem[] = []

      // Parse markdown table rows
      const tableRows = body.split('\n').filter(line => line.includes('|') && !line.match(/^\s*\|[\s-|]+\|\s*$/))
      for (const row of tableRows) {
        const cells = row.split('|').map(c => c.trim()).filter(Boolean)
        if (cells.length >= 4 && cells[0] !== 'Category') {
          const costStr = cells[2].replace(/[^0-9.]/g, '')
          items.push({
            category: cells[0],
            item: cells[1],
            monthlyCost: parseFloat(costStr) || 0,
            notes: cells[3],
          })
        }
      }

      const monthlyCost = items.reduce((sum, item) => sum + item.monthlyCost, 0)
      tiers.push({ name, users, monthlyCost, items })
    }

    // Extract optimizations
    const optSection = md.match(/## Optimizations\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    if (optSection?.[1]) {
      const lines = optSection[1].split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          optimizations.push(trimmed.slice(2).trim())
        }
      }
    }

    if (tiers.length === 0 && optimizations.length === 0) {
      return null
    }

    return { tiers, optimizations }
  } catch {
    return null
  }
}

/**
 * Load cost estimate data
 */
export function loadCostEstimate(): CostEstimate | null {
  const content = costFiles['/product/cost-estimator/cost-estimate.md']
  return content ? parseCostEstimate(content) : null
}

/**
 * Check if cost estimate has been defined
 */
export function hasCostEstimate(): boolean {
  return '/product/cost-estimator/cost-estimate.md' in costFiles
}
