/**
 * Section data loading utilities for spec.md, data.json, and screen designs
 *
 * File structure:
 * - product/sections/[section-id]/spec.md     - Section specification
 * - product/sections/[section-id]/data.json   - Sample data
 * - src/sections/[section-id]/[PageName].tsx  - Screen design pages
 */

import type { SectionData, ParsedSpec, ScreenDesignInfo, ScreenshotInfo } from '@/types/section'
import type { ComponentType } from 'react'

// Load spec.md files from product/sections at build time
const specFiles = import.meta.glob('/product/sections/*/spec.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Load data.json files from product/sections at build time
const dataFiles = import.meta.glob('/product/sections/*/data.json', {
  eager: true,
}) as Record<string, { default: Record<string, unknown> }>

// Load screen design components from src/sections lazily
const screenDesignModules = import.meta.glob('/src/sections/*/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

// Load screenshot files from product/sections at build time
const screenshotFiles = import.meta.glob('/product/sections/*/*.png', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Extract section ID from a product/sections file path
 * e.g., "/product/sections/invoices/spec.md" -> "invoices"
 */
function extractSectionIdFromProduct(path: string): string | null {
  const match = path.match(/\/product\/sections\/([^/]+)\//)
  return match?.[1] || null
}

/**
 * Extract section ID from a src/sections file path
 * e.g., "/src/sections/invoices/InvoiceList.tsx" -> "invoices"
 */
function extractSectionIdFromSrc(path: string): string | null {
  const match = path.match(/\/src\/sections\/([^/]+)\//)
  return match?.[1] || null
}

/**
 * Extract screen design name from a file path
 * e.g., "/src/sections/invoices/InvoiceList.tsx" -> "InvoiceList"
 */
function extractScreenDesignName(path: string): string | null {
  const match = path.match(/\/src\/sections\/[^/]+\/([^/]+)\.tsx$/)
  return match?.[1] || null
}

/**
 * Extract screenshot name from a file path
 * e.g., "/product/sections/invoices/invoice-list.png" -> "invoice-list"
 */
function extractScreenshotName(path: string): string | null {
  const match = path.match(/\/product\/sections\/[^/]+\/([^/]+)\.png$/)
  return match?.[1] || null
}

/**
 * Parse spec.md content into ParsedSpec structure
 *
 * Expected format:
 * # Section Specification
 *
 * ## Overview
 * [Brief description of the section]
 *
 * ## User Flows
 * - Flow 1
 * - Flow 2
 *
 * ## UI Requirements
 * - Requirement 1
 * - Requirement 2
 *
 * ## Configuration (optional)
 * - shell: false (to disable app shell wrapping for this section's screen designs)
 */
export function parseSpec(md: string): ParsedSpec | null {
  if (!md || !md.trim()) return null

  try {
    // Extract title from first # heading
    const titleMatch = md.match(/^#\s+(.+)$/m)
    const title = titleMatch?.[1]?.trim() || 'Section Specification'

    // Extract overview - content between ## Overview and next ##
    const overviewMatch = md.match(/## Overview\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const overview = overviewMatch?.[1]?.trim() || ''

    // Extract user flows - bullet list after ## User Flows
    const userFlowsSection = md.match(/## User Flows\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const userFlows: string[] = []

    if (userFlowsSection?.[1]) {
      const lines = userFlowsSection[1].split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          userFlows.push(trimmed.slice(2).trim())
        }
      }
    }

    // Extract UI requirements - bullet list after ## UI Requirements
    const uiReqSection = md.match(/## UI Requirements\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    const uiRequirements: string[] = []

    if (uiReqSection?.[1]) {
      const lines = uiReqSection[1].split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('- ')) {
          uiRequirements.push(trimmed.slice(2).trim())
        }
      }
    }

    // Extract configuration - check for shell: false
    // Look for "shell: false" or "- shell: false" anywhere in the document
    const shellDisabled = /(?:^|\n)\s*-?\s*shell\s*:\s*false/i.test(md)
    const useShell = !shellDisabled

    return { title, overview, userFlows, uiRequirements, useShell }
  } catch {
    return null
  }
}

/**
 * Get screen designs for a specific section
 */
export function getSectionScreenDesigns(sectionId: string): ScreenDesignInfo[] {
  const screenDesigns: ScreenDesignInfo[] = []
  const prefix = `/src/sections/${sectionId}/`

  for (const path of Object.keys(screenDesignModules)) {
    if (path.startsWith(prefix)) {
      const name = extractScreenDesignName(path)
      if (name) {
        screenDesigns.push({
          name,
          path,
          componentName: name,
        })
      }
    }
  }

  return screenDesigns
}

/**
 * Get screenshots for a specific section
 */
export function getSectionScreenshots(sectionId: string): ScreenshotInfo[] {
  const screenshots: ScreenshotInfo[] = []
  const prefix = `/product/sections/${sectionId}/`

  for (const [path, url] of Object.entries(screenshotFiles)) {
    if (path.startsWith(prefix)) {
      const name = extractScreenshotName(path)
      if (name) {
        screenshots.push({
          name,
          path,
          url,
        })
      }
    }
  }

  return screenshots
}

/**
 * Load screen design component dynamically
 */
export function loadScreenDesignComponent(
  sectionId: string,
  screenDesignName: string
): (() => Promise<{ default: ComponentType }>) | null {
  const path = `/src/sections/${sectionId}/${screenDesignName}.tsx`
  return screenDesignModules[path] || null
}

/**
 * Load all data for a specific section
 */
export function loadSectionData(sectionId: string): SectionData {
  const specPath = `/product/sections/${sectionId}/spec.md`
  const dataPath = `/product/sections/${sectionId}/data.json`

  const specContent = specFiles[specPath] || null
  const dataModule = dataFiles[dataPath]
  const data = dataModule?.default || null

  return {
    sectionId,
    spec: specContent,
    specParsed: specContent ? parseSpec(specContent) : null,
    data,
    screenDesigns: getSectionScreenDesigns(sectionId),
    screenshots: getSectionScreenshots(sectionId),
  }
}

/**
 * Check if a section has a spec.md file
 */
export function hasSectionSpec(sectionId: string): boolean {
  return `/product/sections/${sectionId}/spec.md` in specFiles
}

/**
 * Check if a section's screen designs should use the app shell
 * Returns true by default, false if spec contains "shell: false"
 */
export function sectionUsesShell(sectionId: string): boolean {
  const specPath = `/product/sections/${sectionId}/spec.md`
  const specContent = specFiles[specPath]
  if (!specContent) return true // Default to using shell if no spec

  const parsed = parseSpec(specContent)
  return parsed?.useShell ?? true
}

/**
 * Check if a section has a data.json file
 */
export function hasSectionData(sectionId: string): boolean {
  return `/product/sections/${sectionId}/data.json` in dataFiles
}

/**
 * Get all section IDs that have any artifacts
 */
export function getAllSectionIds(): string[] {
  const ids = new Set<string>()

  for (const path of Object.keys(specFiles)) {
    const id = extractSectionIdFromProduct(path)
    if (id) ids.add(id)
  }

  for (const path of Object.keys(dataFiles)) {
    const id = extractSectionIdFromProduct(path)
    if (id) ids.add(id)
  }

  for (const path of Object.keys(screenDesignModules)) {
    const id = extractSectionIdFromSrc(path)
    if (id) ids.add(id)
  }

  return Array.from(ids)
}
