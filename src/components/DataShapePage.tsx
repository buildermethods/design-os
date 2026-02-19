import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'

export function DataShapePage() {
  const productData = useMemo(() => loadProductData(), [])
  const dataShape = productData.dataShape

  const hasDataShape = !!dataShape
  const stepStatus: StepStatus = hasDataShape ? 'completed' : 'current'

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Data Shape
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Sketch out the general shape of your product's data — the core entities and how they relate.
          </p>
        </div>

        {/* Step 1: Data Shape */}
        <StepIndicator step={1} status={stepStatus} isLast={!hasDataShape}>
          {!dataShape ? (
            <EmptyState type="data-shape" />
          ) : (
            <div className="space-y-6">
              {/* Entities */}
              <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    Entities
                    <span className="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                      ({dataShape.entities.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dataShape.entities.length === 0 ? (
                    <p className="text-stone-500 dark:text-stone-400">No entities defined.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {dataShape.entities.map((entity, index) => (
                        <div
                          key={index}
                          className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4"
                        >
                          <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                            {entity.name}
                          </h3>
                          <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                            {entity.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Relationships */}
              <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    Relationships
                    <span className="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                      ({dataShape.relationships.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dataShape.relationships.length === 0 ? (
                    <p className="text-stone-500 dark:text-stone-400">No relationships defined.</p>
                  ) : (
                    <ul className="space-y-2">
                      {dataShape.relationships.map((relationship, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-stone-500 mt-2 shrink-0" />
                          <span className="text-stone-700 dark:text-stone-300">
                            {relationship}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Edit hint */}
              <div className="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-3">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  To update the data shape, run{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">/data-shape</code>{' '}
                  or edit the file directly at{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">
                    product/data-shape/data-shape.md
                  </code>
                </p>
              </div>
            </div>
          )}
        </StepIndicator>

        {/* Next Phase Button - shown when all steps complete */}
        {hasDataShape && (
          <StepIndicator step={2} status="current" isLast>
            <NextPhaseButton nextPhase="design" />
          </StepIndicator>
        )}
      </div>
    </AppLayout>
  )
}
