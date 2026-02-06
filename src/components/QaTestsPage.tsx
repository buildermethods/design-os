import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'
import type { TestCase } from '@/types/product'

const priorityStyles: Record<string, string> = {
  critical: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  high: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  low: 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400',
}

export function QaTestsPage() {
  const productData = useMemo(() => loadProductData(), [])
  const qaTests = productData.qaTests

  const hasQaTests = !!qaTests
  const stepStatus: StepStatus = hasQaTests ? 'completed' : 'current'

  // Group test cases by section
  const groupedTests = useMemo(() => {
    if (!qaTests) return new Map<string, TestCase[]>()
    const groups = new Map<string, TestCase[]>()
    for (const tc of qaTests.testCases) {
      const section = tc.section || 'General'
      if (!groups.has(section)) groups.set(section, [])
      groups.get(section)!.push(tc)
    }
    return groups
  }, [qaTests])

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            QA Test Cases
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Generated test cases for validating your product's functionality.
          </p>
        </div>

        {/* Step 1: Test Cases */}
        <StepIndicator step={1} status={stepStatus} isLast={!hasQaTests}>
          {!qaTests ? (
            <EmptyState type="qa-tests" />
          ) : (
            <div className="space-y-6">
              {/* Coverage Summary */}
              {qaTests.coverageSummary && (
                <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Coverage Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {qaTests.coverageSummary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['critical', 'high', 'medium', 'low'] as const).map((priority) => {
                  const count = qaTests.testCases.filter(tc => tc.priority === priority).length
                  return (
                    <div key={priority} className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-semibold text-stone-900 dark:text-stone-100">{count}</div>
                      <div className={`text-xs font-medium uppercase tracking-wide mt-0.5 ${priorityStyles[priority].split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>
                        {priority}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Test Cases by Section */}
              {[...groupedTests.entries()].map(([section, cases]) => (
                <Card key={section} className="border-stone-200 dark:border-stone-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      {section}
                      <span className="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                        ({cases.length} tests)
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cases.map((tc) => (
                        <div
                          key={tc.id}
                          className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                              {tc.id}
                            </span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyles[tc.priority]}`}>
                              {tc.priority}
                            </span>
                          </div>
                          <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-2">
                            {tc.title}
                          </h4>
                          {tc.steps.length > 0 && (
                            <ol className="space-y-1 mb-2">
                              {tc.steps.map((step, si) => (
                                <li key={si} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                                  <span className="text-xs font-medium text-stone-400 dark:text-stone-500 mt-0.5 shrink-0 w-4 text-right">
                                    {si + 1}.
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          )}
                          {tc.expectedResult && (
                            <div className="text-sm mt-2 pt-2 border-t border-stone-200 dark:border-stone-700">
                              <span className="font-medium text-stone-700 dark:text-stone-300">Expected: </span>
                              <span className="text-stone-600 dark:text-stone-400">{tc.expectedResult}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Edit hint */}
              <div className="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-3">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  To regenerate test cases, run{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">/qa-tests</code>{' '}
                  or edit the file directly at{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">
                    product/qa-tests/qa-tests.md
                  </code>
                </p>
              </div>
            </div>
          )}
        </StepIndicator>

        {/* Next Phase Button */}
        {hasQaTests && (
          <StepIndicator step={2} status="current" isLast>
            <NextPhaseButton nextPhase="export" />
          </StepIndicator>
        )}
      </div>
    </AppLayout>
  )
}
