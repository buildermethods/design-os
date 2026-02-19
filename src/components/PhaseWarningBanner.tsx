import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, X } from 'lucide-react'
import { loadProductData } from '@/lib/product-loader'

/**
 * Get a storage key based on the product name to track dismissed warnings per product
 * Converts " & " to "-and-" to maintain semantic meaning
 */
function getStorageKey(productName: string): string {
  const sanitized = productName
    .toLowerCase()
    .replace(/\s+&\s+/g, '-and-') // Convert " & " to "-and-" first
    .replace(/[^a-z0-9]+/g, '-')
  return `design-os-phase-warning-dismissed-${sanitized}`
}

export function PhaseWarningBanner() {
  const productData = useMemo(() => loadProductData(), [])
  const [isDismissed, setIsDismissed] = useState(true) // Start dismissed to avoid flash

  const hasDataModel = !!productData.dataModel
  const hasDesignSystem = !!(productData.designSystem?.colors || productData.designSystem?.typography)
  const hasShell = !!productData.shell?.spec
  const hasDesign = hasDesignSystem || hasShell

  const productName = productData.overview?.name || 'default-product'
  const storageKey = getStorageKey(productName)

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey) === 'true'
    setIsDismissed(dismissed)
  }, [storageKey])

  const handleDismiss = () => {
    localStorage.setItem(storageKey, 'true')
    setIsDismissed(true)
  }

  // Don't show if both phases are complete or if dismissed
  if ((hasDataModel && hasDesign) || isDismissed) {
    return null
  }

  // Build the warning message
  const missingPhases: { name: string; path: string }[] = []
  if (!hasDataModel) {
    missingPhases.push({ name: 'Data Model', path: '/data-model' })
  }
  if (!hasDesign) {
    missingPhases.push({ name: 'Design', path: '/design' })
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" strokeWidth={2} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Consider completing{' '}
            {missingPhases.map((phase, index) => (
              <span key={phase.path}>
                {index > 0 && ' and '}
                <Link
                  to={phase.path}
                  className="font-medium underline hover:no-underline"
                >
                  {phase.name}
                </Link>
              </span>
            ))}{' '}
            before designing sections.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors shrink-0"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
