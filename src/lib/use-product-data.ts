/**
 * Custom hook for loading product data asynchronously
 * Provides a consistent loading pattern across all pages
 */

import { useState, useEffect } from 'react'
import { fetchProductData } from '@/lib/product-loader'
import type { ProductData } from '@/types/product'

export function useProductData() {
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchProductData().then((data) => {
      if (!cancelled) {
        setProductData(data)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return { productData, loading }
}
