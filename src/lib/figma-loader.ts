/**
 * Figma integration loading utilities
 */

import type { FigmaIntegration, FigmaLink } from '@/types/product'

// Load figma config from product/design-system at build time
const figmaFiles = import.meta.glob('/product/design-system/figma.json', {
  eager: true,
}) as Record<string, { default: Record<string, unknown> }>

/**
 * Parse figma.json into FigmaIntegration structure
 *
 * Expected format:
 * {
 *   "fileUrl": "https://www.figma.com/design/...",
 *   "embedUrl": "https://www.figma.com/embed?...",
 *   "accessToken": "",
 *   "links": [
 *     { "label": "Main Design File", "url": "https://...", "type": "file" },
 *     { "label": "Prototype", "url": "https://...", "type": "prototype" }
 *   ]
 * }
 */
export function loadFigmaIntegration(): FigmaIntegration | null {
  const figmaModule = figmaFiles['/product/design-system/figma.json']
  if (!figmaModule?.default) return null

  const data = figmaModule.default
  if (!data.fileUrl && (!data.links || !Array.isArray(data.links) || (data.links as unknown[]).length === 0)) {
    return null
  }

  const links: FigmaLink[] = []
  if (Array.isArray(data.links)) {
    for (const link of data.links) {
      const l = link as Record<string, string>
      if (l.label && l.url) {
        const validTypes = ['file', 'prototype', 'board', 'frame'] as const
        const type = validTypes.includes(l.type as typeof validTypes[number])
          ? (l.type as FigmaLink['type'])
          : 'file'
        links.push({ label: l.label, url: l.url, type })
      }
    }
  }

  return {
    fileUrl: (data.fileUrl as string) || '',
    embedUrl: (data.embedUrl as string) || '',
    links,
    accessToken: (data.accessToken as string) || '',
  }
}

/**
 * Check if Figma integration has been configured
 */
export function hasFigma(): boolean {
  return '/product/design-system/figma.json' in figmaFiles
}
