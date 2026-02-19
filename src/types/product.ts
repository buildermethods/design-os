/**
 * Product types for Design OS v2
 */

// =============================================================================
// Product Overview
// =============================================================================

export interface Problem {
  title: string
  solution: string
}

export interface ProductOverview {
  name: string
  description: string
  problems: Problem[]
  features: string[]
}

// =============================================================================
// Product Roadmap
// =============================================================================

export interface Section {
  id: string // slug derived from title
  title: string
  description: string
  order: number
}

export interface ProductRoadmap {
  sections: Section[]
}

// =============================================================================
// Data Model
// =============================================================================

export interface Entity {
  name: string
  description: string
}

export interface DataModel {
  entities: Entity[]
  relationships: string[]
}

// =============================================================================
// Design System
// =============================================================================

export interface ColorTokens {
  primary: string
  secondary: string
  neutral: string
}

export interface TypographyTokens {
  heading: string
  body: string
  mono: string
}

export interface DesignSystem {
  colors: ColorTokens | null
  typography: TypographyTokens | null
}

// =============================================================================
// Application Shell
// =============================================================================

export interface ShellSpec {
  raw: string
  overview: string
  navigationItems: string[]
  layoutPattern: string
}

export interface ShellInfo {
  spec: ShellSpec | null
  hasComponents: boolean
}

// =============================================================================
// Combined Product Data
// =============================================================================

export interface ProductData {
  overview: ProductOverview | null
  roadmap: ProductRoadmap | null
  dataModel: DataModel | null
  designSystem: DesignSystem | null
  shell: ShellInfo | null
}
