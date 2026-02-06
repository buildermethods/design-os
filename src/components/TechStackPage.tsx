import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'

export function TechStackPage() {
  const productData = useMemo(() => loadProductData(), [])
  const techStack = productData.techStack

  const hasTechStack = !!techStack
  const stepStatus: StepStatus = hasTechStack ? 'completed' : 'current'

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Tech Stack & Architecture
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Define the technology choices and architecture for your product.
          </p>
        </div>

        {/* Step 1: Tech Stack */}
        <StepIndicator step={1} status={stepStatus} isLast={!hasTechStack}>
          {!techStack ? (
            <EmptyState type="tech-stack" />
          ) : (
            <div className="space-y-6">
              {/* Technology Choices */}
              <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    Technology Choices
                    <span className="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                      ({techStack.choices.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {techStack.choices.length === 0 ? (
                    <p className="text-stone-500 dark:text-stone-400">No technology choices defined.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {techStack.choices.map((choice, index) => (
                        <div
                          key={index}
                          className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4"
                        >
                          <div className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">
                            {choice.category}
                          </div>
                          <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                            {choice.choice}
                          </h3>
                          <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                            {choice.rationale}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Architecture Layers */}
              <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    Architecture
                    <span className="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                      ({techStack.architecture.length} layers)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {techStack.architecture.length === 0 ? (
                    <p className="text-stone-500 dark:text-stone-400">No architecture layers defined.</p>
                  ) : (
                    <div className="space-y-4">
                      {techStack.architecture.map((layer, index) => (
                        <div
                          key={index}
                          className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4"
                        >
                          <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                            {layer.name}
                          </h3>
                          <p className="text-stone-600 dark:text-stone-400 text-sm mb-2">
                            {layer.description}
                          </p>
                          {layer.components.length > 0 && (
                            <ul className="space-y-1">
                              {layer.components.map((component, ci) => (
                                <li key={ci} className="flex items-start gap-2 text-sm text-stone-700 dark:text-stone-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-stone-500 mt-1.5 shrink-0" />
                                  {component}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Architecture Diagram */}
              {techStack.diagram && (
                <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Architecture Diagram
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4 text-sm text-stone-700 dark:text-stone-300 font-mono overflow-x-auto whitespace-pre">
                      {techStack.diagram}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {/* Edit hint */}
              <div className="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-3">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  To update the tech stack, run{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">/tech-stack</code>{' '}
                  or edit the file directly at{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">
                    product/tech-stack/tech-stack.md
                  </code>
                </p>
              </div>
            </div>
          )}
        </StepIndicator>

        {/* Next Phase Button */}
        {hasTechStack && (
          <StepIndicator step={2} status="current" isLast>
            <NextPhaseButton nextPhase="cost-estimator" />
          </StepIndicator>
        )}
      </div>
    </AppLayout>
  )
}
