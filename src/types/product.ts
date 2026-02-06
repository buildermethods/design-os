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
// Tech Stack & Architecture
// =============================================================================

export interface TechChoice {
  category: string
  choice: string
  rationale: string
}

export interface ArchitectureLayer {
  name: string
  description: string
  components: string[]
}

export interface TechStack {
  choices: TechChoice[]
  architecture: ArchitectureLayer[]
  diagram: string
}

// =============================================================================
// Cost Estimator
// =============================================================================

export interface CostLineItem {
  category: string
  item: string
  monthlyCost: number
  notes: string
}

export interface CostTier {
  name: string
  users: string
  monthlyCost: number
  items: CostLineItem[]
}

export interface CostEstimate {
  tiers: CostTier[]
  optimizations: string[]
}

// =============================================================================
// QA Test Cases
// =============================================================================

export interface TestCase {
  id: string
  title: string
  section: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  steps: string[]
  expectedResult: string
}

export interface QaTestSuite {
  testCases: TestCase[]
  coverageSummary: string
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
  techStack: TechStack | null
  costEstimate: CostEstimate | null
  qaTests: QaTestSuite | null
}
