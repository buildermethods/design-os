import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'

export function CostEstimatorPage() {
  const productData = useMemo(() => loadProductData(), [])
  const costEstimate = productData.costEstimate

  const hasCostEstimate = !!costEstimate
  const stepStatus: StepStatus = hasCostEstimate ? 'completed' : 'current'

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Cost Estimator & Optimizer
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Estimate infrastructure and service costs, and identify optimizations.
          </p>
        </div>

        {/* Step 1: Cost Estimate */}
        <StepIndicator step={1} status={stepStatus} isLast={!hasCostEstimate}>
          {!costEstimate ? (
            <EmptyState type="cost-estimator" />
          ) : (
            <div className="space-y-6">
              {/* Cost Tiers */}
              {costEstimate.tiers.map((tier, index) => (
                <Card key={index} className="border-stone-200 dark:border-stone-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span>{tier.name}</span>
                      <span className="text-sm font-normal text-stone-500 dark:text-stone-400">
                        {tier.users}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Total */}
                      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
                        <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                          Estimated Monthly Cost
                        </span>
                        <span className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                          ${tier.monthlyCost.toLocaleString()}/mo
                        </span>
                      </div>

                      {/* Line items */}
                      {tier.items.length > 0 && (
                        <div className="space-y-2">
                          {tier.items.map((item, ii) => (
                            <div
                              key={ii}
                              className="flex items-start justify-between gap-4 py-2 bg-stone-50 dark:bg-stone-800/50 rounded-lg px-3"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                                  {item.category}
                                </div>
                                <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                                  {item.item}
                                </div>
                                {item.notes && (
                                  <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                    {item.notes}
                                  </div>
                                )}
                              </div>
                              <div className="text-sm font-medium text-stone-700 dark:text-stone-300 shrink-0">
                                ${item.monthlyCost.toLocaleString()}/mo
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Optimizations */}
              {costEstimate.optimizations.length > 0 && (
                <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Cost Optimizations
                      <span className="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                        ({costEstimate.optimizations.length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {costEstimate.optimizations.map((opt, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-2 shrink-0" />
                          <span className="text-stone-700 dark:text-stone-300">
                            {opt}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Edit hint */}
              <div className="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-3">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  To update the cost estimate, run{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">/cost-estimator</code>{' '}
                  or edit the file directly at{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">
                    product/cost-estimator/cost-estimate.md
                  </code>
                </p>
              </div>
            </div>
          )}
        </StepIndicator>

        {/* Next Phase Button */}
        {hasCostEstimate && (
          <StepIndicator step={2} status="current" isLast>
            <NextPhaseButton nextPhase="qa-tests" />
          </StepIndicator>
        )}
      </div>
    </AppLayout>
  )
}
