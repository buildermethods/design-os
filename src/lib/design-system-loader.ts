/**
 * Design system loading utilities for colors and typography
 */

import type { DesignSystem, ColorTokens, TypographyTokens } from '@/types/product'
import { loadFigmaIntegration, hasFigma as hasFigmaConfig } from './figma-loader'

// Load JSON files from product/design-system at build time
const designSystemFiles = import.meta.glob('/product/design-system/*.json', {
  eager: true,
}) as Record<string, { default: Record<string, string> }>

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
export function loadColorTokens(): ColorTokens | null {
  const colorsModule = designSystemFiles['/product/design-system/colors.json']
  if (!colorsModule?.default) return null

  const colors = colorsModule.default
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
export function loadTypographyTokens(): TypographyTokens | null {
  const typographyModule = designSystemFiles['/product/design-system/typography.json']
  if (!typographyModule?.default) return null

  const typography = typographyModule.default
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
 * Load the complete design system
 */
export function loadDesignSystem(): DesignSystem | null {
  const colors = loadColorTokens()
  const typography = loadTypographyTokens()
  const figma = loadFigmaIntegration()

  // Return null if nothing is defined
  if (!colors && !typography && !figma) {
    return null
  }

  return { colors, typography, figma }
}

/**
 * Check if design system has been defined (at least colors or typography)
 */
export function hasDesignSystem(): boolean {
  return (
    '/product/design-system/colors.json' in designSystemFiles ||
    '/product/design-system/typography.json' in designSystemFiles
  )
}

/**
 * Check if colors have been defined
 */
export function hasColors(): boolean {
  return '/product/design-system/colors.json' in designSystemFiles
}

/**
 * Check if typography has been defined
 */
export function hasTypography(): boolean {
  return '/product/design-system/typography.json' in designSystemFiles
}

/**
 * Check if Figma integration has been configured
 */
export function hasFigma(): boolean {
  return hasFigmaConfig()
}
