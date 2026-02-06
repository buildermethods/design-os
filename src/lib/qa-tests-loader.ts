/**
 * QA Test Case Generator data loading utilities
 */

import type { QaTestSuite, TestCase } from '@/types/product'

// Load QA test files from /product/qa-tests/ directory at build time
const qaFiles = import.meta.glob('/product/qa-tests/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Parse qa-tests.md content into QaTestSuite structure
 *
 * Expected format:
 * # QA Test Cases
 *
 * ## Coverage Summary
 * [Summary text]
 *
 * ## Test Cases
 *
 * ### TC-001: [Title]
 * **Section:** [Section Name]
 * **Priority:** critical|high|medium|low
 * **Steps:**
 * 1. Step one
 * 2. Step two
 * **Expected Result:** [Result description]
 */
export function parseQaTests(md: string): QaTestSuite | null {
  if (!md || !md.trim()) return null

  try {
    const testCases: TestCase[] = []
    let coverageSummary = ''

    // Extract Coverage Summary
    const summaryMatch = md.match(/## Coverage Summary\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    if (summaryMatch?.[1]) {
      coverageSummary = summaryMatch[1].trim()
    }

    // Extract Test Cases
    const casesSection = md.match(/## Test Cases\s*\n+([\s\S]*?)(?=\n## [^#]|\n#[^#]|$)/)
    if (casesSection?.[1]) {
      const caseMatches = [...casesSection[1].matchAll(/### (TC-\d+):\s*(.+)\n+([\s\S]*?)(?=\n### |\n## |$)/g)]
      for (const match of caseMatches) {
        const id = match[1].trim()
        const title = match[2].trim()
        const body = match[3].trim()

        const sectionMatch = body.match(/\*\*Section:\*\*\s*(.+)/)
        const priorityMatch = body.match(/\*\*Priority:\*\*\s*(.+)/)
        const expectedMatch = body.match(/\*\*Expected Result:\*\*\s*(.+)/)

        const steps: string[] = []
        const stepsSection = body.match(/\*\*Steps:\*\*\s*\n+([\s\S]*?)(?=\*\*Expected|\n### |$)/)
        if (stepsSection?.[1]) {
          const lines = stepsSection[1].split('\n')
          for (const line of lines) {
            const trimmed = line.trim()
            const stepMatch = trimmed.match(/^\d+\.\s+(.+)/)
            if (stepMatch) {
              steps.push(stepMatch[1].trim())
            }
          }
        }

        const priority = (priorityMatch?.[1]?.trim().toLowerCase() || 'medium') as TestCase['priority']

        testCases.push({
          id,
          title,
          section: sectionMatch?.[1]?.trim() || '',
          priority: ['critical', 'high', 'medium', 'low'].includes(priority) ? priority : 'medium',
          steps,
          expectedResult: expectedMatch?.[1]?.trim() || '',
        })
      }
    }

    if (testCases.length === 0) {
      return null
    }

    return { testCases, coverageSummary }
  } catch {
    return null
  }
}

/**
 * Load QA test suite data
 */
export function loadQaTests(): QaTestSuite | null {
  const content = qaFiles['/product/qa-tests/qa-tests.md']
  return content ? parseQaTests(content) : null
}

/**
 * Check if QA tests have been defined
 */
export function hasQaTests(): boolean {
  return '/product/qa-tests/qa-tests.md' in qaFiles
}
