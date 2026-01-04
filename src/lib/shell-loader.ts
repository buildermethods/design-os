/**
 * Shell loading and parsing utilities
 * Uses dynamic fetch() for specs, import.meta.glob for components
 */

import type { ShellSpec, ShellInfo } from '@/types/product'
import type { ComponentType, ReactNode } from 'react'

// Load shell components lazily (these still need build-time resolution)
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

  // Normalize line endings (Windows \r\n -> Unix \n)
  const content = md.replace(/\r\n/g, '\n')

  try {
    // Extract overview
    const overviewMatch = content.match(/## Overview\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const overview = overviewMatch?.[1]?.trim() || ''

    // Extract navigation items
    const navSection = content.match(/## Navigation Structure\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
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
    const layoutMatch = content.match(/## Layout Pattern\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const layoutPattern = layoutMatch?.[1]?.trim() || ''

    // Return null if we couldn't parse anything meaningful
    if (!overview && navigationItems.length === 0 && !layoutPattern) {
      return null
    }

    return {
      raw: content,
      overview,
      navigationItems,
      layoutPattern,
    }
  } catch {
    return null
  }
}

/**
 * Check if shell components exist (synchronous - build-time check)
 */
export function hasShellComponents(): boolean {
  return '/src/shell/components/AppShell.tsx' in shellComponentModules
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
 * Load shell spec from markdown file (async)
 */
export async function loadShellSpec(): Promise<ShellSpec | null> {
  const content = await fetchText('/product/shell/spec.md')
  return content ? parseShellSpec(content) : null
}

/**
 * Load the complete shell info (async)
 */
export async function loadShellInfo(): Promise<ShellInfo | null> {
  const spec = await loadShellSpec()
  const hasComponents = hasShellComponents()

  // Return null if neither spec nor components exist
  if (!spec && !hasComponents) {
    return null
  }

  return { spec, hasComponents }
}

/**
 * Check if shell has been defined (async for spec, sync for components)
 */
export async function hasShell(): Promise<boolean> {
  const spec = await loadShellSpec()
  return spec !== null || hasShellComponents()
}

/**
 * Check if shell spec has been defined (async)
 */
export async function hasShellSpec(): Promise<boolean> {
  const spec = await loadShellSpec()
  return spec !== null
}

/**
 * Get list of shell component names (synchronous - build-time check)
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
