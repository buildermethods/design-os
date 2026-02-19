import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'

export function DataModelPage() {
  const productData = useMemo(() => loadProductData(), [])
  const dataModel = productData.dataModel

  const hasDataModel = !!dataModel
  const stepStatus: StepStatus = hasDataModel ? 'completed' : 'current'

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Data Model
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Define the core entities and relationships in your product.
          </p>
        </div>

        {/* Step 1: Data Model */}
        <StepIndicator step={1} status={stepStatus} isLast={!hasDataModel}>
          {!dataModel ? (
            <EmptyState type="data-model" />
          ) : (
            <div className="space-y-6">
              {/* Entities */}
              <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    Entities
                    <span className="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                      ({dataModel.entities.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dataModel.entities.length === 0 ? (
                    <p className="text-stone-500 dark:text-stone-400">No entities defined.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {dataModel.entities.map((entity, index) => (
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
                      ({dataModel.relationships.length})
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dataModel.relationships.length === 0 ? (
                    <p className="text-stone-500 dark:text-stone-400">No relationships defined.</p>
                  ) : (
                    <ul className="space-y-2">
                      {dataModel.relationships.map((relationship, index) => (
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
                  To update the data model, run{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">/data-model</code>{' '}
                  or edit the file directly at{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">
                    product/data-model/data-model.md
                  </code>
                </p>
              </div>
            </div>
          )}
        </StepIndicator>

        {/* Next Phase Button - shown when all steps complete */}
        {hasDataModel && (
          <StepIndicator step={2} status="current" isLast>
            <NextPhaseButton nextPhase="design" />
          </StepIndicator>
        )}
      </div>
    </AppLayout>
  )
}
