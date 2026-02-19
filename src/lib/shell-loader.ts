/**
 * Shell loading and parsing utilities
 */

import type { ShellSpec, ShellInfo } from '@/types/product'
import type { ComponentType, ReactNode } from 'react'

// Load shell spec markdown file at build time
const shellSpecFiles = import.meta.glob('/product/shell/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Load shell components lazily
const shellComponentModules = import.meta.glob('/src/shell/components/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

// Load shell preview component lazily
const shellPreviewModules = import.meta.glob('/src/shell/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

/**
 * Parse shell spec.md content into ShellSpec structure
 *
 * Expected format:
 * # Application Shell Specification
 *
 * ## Overview
 * Description of the shell design
 *
 * ## Navigation Structure
 * - Nav Item 1 → Section
 * - Nav Item 2 → Section
 *
 * ## Layout Pattern
 * Description of layout (sidebar, top nav, etc.)
 */
export function parseShellSpec(md: string): ShellSpec | null {
  if (!md || !md.trim()) return null

  try {
    // Extract overview
    const overviewMatch = md.match(/## Overview\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const overview = overviewMatch?.[1]?.trim() || ''

    // Extract navigation items
    const navSection = md.match(/## Navigation Structure\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const navigationItems: string[] = []

    if (navSection?.[1]) {
      const lines = navSection[1].split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          navigationItems.push(trimmed.slice(2).trim())
        }
      }
    }

    // Extract layout pattern
    const layoutMatch = md.match(/## Layout Pattern\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const layoutPattern = layoutMatch?.[1]?.trim() || ''

    // Return null if we couldn't parse anything meaningful
    if (!overview && navigationItems.length === 0 && !layoutPattern) {
      return null
    }

    return {
      raw: md,
      overview,
      navigationItems,
      layoutPattern,
    }
  } catch {
    return null
  }
}

/**
 * Check if shell components exist
 */
export function hasShellComponents(): boolean {
  // Check if AppShell.tsx exists
  const exists = '/src/shell/components/AppShell.tsx' in shellComponentModules
  // Debug: log available shell components
  console.log('[Shell] hasShellComponents check:', {
    exists,
    availableComponents: Object.keys(shellComponentModules),
    lookingFor: '/src/shell/components/AppShell.tsx'
  })
  return exists
}

/**
 * Load shell component dynamically
 */
export function loadShellComponent(
  componentName: string
): (() => Promise<{ default: ComponentType }>) | null {
  const path = `/src/shell/components/${componentName}.tsx`
  return shellComponentModules[path] || null
}

/**
 * Load AppShell component that can wrap content
 * First tries to load ShellWrapper (designed for wrapping arbitrary content)
 * Falls back to AppShell if ShellWrapper doesn't exist
 */
export function loadAppShell(): (() => Promise<{ default: ComponentType<{ children?: ReactNode }> }>) | null {
  // First try ShellWrapper - a component specifically designed to wrap content
  const wrapperPath = '/src/shell/components/ShellWrapper.tsx'
  if (wrapperPath in shellComponentModules) {
    return shellComponentModules[wrapperPath] as (() => Promise<{ default: ComponentType<{ children?: ReactNode }> }>)
  }
  // Fall back to AppShell
  const path = '/src/shell/components/AppShell.tsx'
  return shellComponentModules[path] as (() => Promise<{ default: ComponentType<{ children?: ReactNode }> }>) || null
}

/**
 * Load shell preview wrapper dynamically
 */
export function loadShellPreview(): (() => Promise<{ default: ComponentType }>) | null {
  return shellPreviewModules['/src/shell/ShellPreview.tsx'] || null
}

/**
 * Load the complete shell info
 */
export function loadShellInfo(): ShellInfo | null {
  const specContent = shellSpecFiles['/product/shell/spec.md']
  const spec = specContent ? parseShellSpec(specContent) : null
  const hasComponents = hasShellComponents()

  // Return null if neither spec nor components exist
  if (!spec && !hasComponents) {
    return null
  }

  return { spec, hasComponents }
}

/**
 * Check if shell has been defined (spec or components)
 */
export function hasShell(): boolean {
  return hasShellSpec() || hasShellComponents()
}

/**
 * Check if shell spec has been defined
 */
export function hasShellSpec(): boolean {
  return '/product/shell/spec.md' in shellSpecFiles
}

/**
 * Get list of shell component names
 */
export function getShellComponentNames(): string[] {
  const names: string[] = []
  for (const path of Object.keys(shellComponentModules)) {
    const match = path.match(/\/src\/shell\/components\/([^/]+)\.tsx$/)
    if (match) {
      names.push(match[1])
    }
  }
  return names
}
