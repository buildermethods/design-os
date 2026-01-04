/**
 * Design system loading utilities for colors and typography
 * Uses dynamic fetch() for hot-reloading support in development
 */

import type { DesignSystem, ColorTokens, TypographyTokens } from '@/types/product'

/**
 * Fetch a JSON file with cache busting for development
 */
async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const cacheBuster = import.meta.env.DEV ? `?t=${Date.now()}` : ''
    const response = await fetch(`${path}${cacheBuster}`)
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

/**
 * Load color tokens from colors.json
 *
 * Expected format:
 * {
 *   "primary": "lime",
 *   "secondary": "teal",
 *   "neutral": "stone"
 * }
 */
export async function loadColorTokens(): Promise<ColorTokens | null> {
  const colors = await fetchJson<Record<string, string>>('/product/design-system/colors.json')
  if (!colors) return null

  if (!colors.primary || !colors.secondary || !colors.neutral) {
    return null
  }

  return {
    primary: colors.primary,
    secondary: colors.secondary,
    neutral: colors.neutral,
  }
}

/**
 * Load typography tokens from typography.json
 *
 * Expected format:
 * {
 *   "heading": "DM Sans",
 *   "body": "DM Sans",
 *   "mono": "IBM Plex Mono"
 * }
 */
export async function loadTypographyTokens(): Promise<TypographyTokens | null> {
  const typography = await fetchJson<Record<string, string>>('/product/design-system/typography.json')
  if (!typography) return null

  if (!typography.heading || !typography.body) {
    return null
  }

  return {
    heading: typography.heading,
    body: typography.body,
    mono: typography.mono || 'IBM Plex Mono',
  }
}

/**
 * Load the complete design system (async)
 */
export async function loadDesignSystem(): Promise<DesignSystem | null> {
  const [colors, typography] = await Promise.all([
    loadColorTokens(),
    loadTypographyTokens(),
  ])

  // Return null if neither colors nor typography are defined
  if (!colors && !typography) {
    return null
  }

  return { colors, typography }
}

/**
 * Check if design system has been defined (async)
 */
export async function hasDesignSystem(): Promise<boolean> {
  const designSystem = await loadDesignSystem()
  return designSystem !== null
}

/**
 * Check if colors have been defined (async)
 */
export async function hasColors(): Promise<boolean> {
  const colors = await loadColorTokens()
  return colors !== null
}

/**
 * Check if typography has been defined (async)
 */
export async function hasTypography(): Promise<boolean> {
  const typography = await loadTypographyTokens()
  return typography !== null
}
