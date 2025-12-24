/**
 * Section types for Design OS v2
 */

export interface SectionData {
  sectionId: string
  spec: string | null
  specParsed: ParsedSpec | null
  data: Record<string, unknown> | null
  screenDesigns: ScreenDesignInfo[]
  screenshots: ScreenshotInfo[]
  accessibility: AccessibilityInfo | null
}

export interface ParsedSpec {
  title: string
  overview: string
  userFlows: string[]
  uiRequirements: string[]
  /** Whether screen designs for this section should be wrapped in the app shell. Defaults to true. */
  useShell: boolean
}

export interface ScreenDesignInfo {
  name: string
  path: string
  componentName: string
}

export interface ScreenshotInfo {
  name: string
  path: string
  url: string
}

export interface AccessibilityInfo {
  report: string | null
  lastAnalyzed: string | null
  checklist: AccessibilityChecklistItem[]
}

export interface AccessibilityChecklistItem {
  id: string
  level: 'A' | 'AA' | 'AAA'
  description: string
  status: 'pass' | 'warning' | 'fail' | 'not-checked'
  screen?: string
}
