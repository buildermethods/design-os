import { Suspense, useMemo, useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Maximize2, GripVertical, Layout, Smartphone, Tablet, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { loadScreenDesignComponent, getSectionScreenDesigns } from '@/lib/section-loader'
import { loadAppShell, hasShellComponents, loadShellInfo } from '@/lib/shell-loader'
import { loadProductData } from '@/lib/product-loader'
import React from 'react'
import type { ComponentType } from 'react'

const MIN_WIDTH = 320
const DEFAULT_WIDTH_PERCENT = 100

export function ScreenDesignPage() {
  const { sectionId, screenDesignName } = useParams<{ sectionId: string; screenDesignName: string }>()
  const navigate = useNavigate()
  const [widthPercent, setWidthPercent] = useState(DEFAULT_WIDTH_PERCENT)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  // Load product data to get section title
  const productData = useMemo(() => loadProductData(), [])
  const section = productData.roadmap?.sections.find((s) => s.id === sectionId)

  // Handle resize drag
  const handleMouseDown = useCallback(() => {
    isDragging.current = true

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width
      const containerCenter = containerRect.left + containerWidth / 2

      // Calculate distance from center
      const distanceFromCenter = Math.abs(e.clientX - containerCenter)
      const maxDistance = containerWidth / 2

      // Convert to percentage (distance from center * 2 = total width)
      let newWidthPercent = (distanceFromCenter / maxDistance) * 100

      // Clamp between min width and 100%
      const minPercent = (MIN_WIDTH / containerWidth) * 100
      newWidthPercent = Math.max(minPercent, Math.min(100, newWidthPercent))

      setWidthPercent(newWidthPercent)
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const previewWidth = `${widthPercent}%`

  return (
    <div className="h-screen bg-stone-100 dark:bg-stone-900 animate-fade-in flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shrink-0 z-50">
        <div className="px-4 py-2 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/sections/${sectionId}`)}
            className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
            Back
          </Button>
          <div className="h-4 w-px bg-stone-200 dark:bg-stone-700" />
          <div className="flex items-center gap-2 min-w-0">
            <Layout className="w-4 h-4 text-stone-400 shrink-0" strokeWidth={1.5} />
            {section && (
              <span className="text-sm text-stone-500 dark:text-stone-400 truncate">
                {section.title}
              </span>
            )}
            <span className="text-stone-300 dark:text-stone-600">/</span>
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate">
              {screenDesignName}
            </span>
          </div>

          {/* Width indicator and device presets */}
          <div className="ml-auto flex items-center gap-4">
            {/* Device size presets */}
            <div className="flex items-center gap-1 border-r border-stone-200 dark:border-stone-700 pr-4">
              <button
                onClick={() => setWidthPercent(30)}
                className={`p-1.5 rounded transition-colors ${
                  widthPercent <= 40
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Mobile (30%)"
              >
                <Smartphone className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setWidthPercent(60)}
                className={`p-1.5 rounded transition-colors ${
                  widthPercent > 40 && widthPercent <= 60
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Tablet (60%)"
              >
                <Tablet className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setWidthPercent(100)}
                className={`p-1.5 rounded transition-colors ${
                  widthPercent > 60
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title="Desktop (100%)"
              >
                <Monitor className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-mono w-10 text-right">
              {Math.round(widthPercent)}%
            </span>
            <ThemeToggle />
            <a
              href={`/sections/${sectionId}/screen-designs/${screenDesignName}/fullscreen`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
              Fullscreen
            </a>
          </div>
        </div>
      </header>

      {/* Preview area with resizable container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden flex items-stretch justify-center p-6"
      >
        {/* Left resize handle */}
        <div
          className="w-4 flex items-center justify-center cursor-ew-resize group shrink-0"
          onMouseDown={handleMouseDown}
        >
          <div className="w-1 h-16 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-stone-400 dark:group-hover:bg-stone-500 transition-colors flex items-center justify-center">
            <GripVertical className="w-3 h-3 text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
          </div>
        </div>

        {/* Preview container using iframe for true isolation */}
        <div
          className="bg-white dark:bg-stone-950 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden"
          style={{ width: previewWidth, minWidth: MIN_WIDTH, maxWidth: '100%' }}
        >
          <iframe
            src={`/sections/${sectionId}/screen-designs/${screenDesignName}/fullscreen`}
            className="w-full h-full border-0"
            title="Screen Design Preview"
          />
        </div>

        {/* Right resize handle */}
        <div
          className="w-4 flex items-center justify-center cursor-ew-resize group shrink-0"
          onMouseDown={handleMouseDown}
        >
          <div className="w-1 h-16 rounded-full bg-stone-300 dark:bg-stone-600 group-hover:bg-stone-400 dark:group-hover:bg-stone-500 transition-colors flex items-center justify-center">
            <GripVertical className="w-3 h-3 text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Navigation Mapping ───
// Maps shell nav labels to section IDs so clicking nav items loads the right section.
// The shell spec uses short labels (e.g. "Products") while section IDs use slugified
// roadmap titles (e.g. "product-catalog"). This mapping bridges the two.

interface NavRoute {
  label: string
  href: string
  sectionId: string | null
  screenDesignName: string | null
}

/**
 * Build the mapping from shell nav items → section IDs → first screen design.
 * Uses shell spec navigation items and cross-references with available screen designs.
 */
function buildNavRoutes(): NavRoute[] {
  const shellInfo = loadShellInfo()
  const productData = loadProductData()
  const specNavItems = shellInfo?.spec?.navigationItems || []
  const roadmapSections = productData.roadmap?.sections || []

  // Parse nav items from spec (format: "**Label** → Section Title")
  const parsedNavItems = specNavItems.length > 0
    ? specNavItems
        .map((item, index) => {
          const labelMatch = item.match(/\*\*([^*]+)\*\*/)
          const label = labelMatch ? labelMatch[1] : item.split('→')[0]?.trim() || `Item ${index + 1}`
          // Extract the target section title after → (strip parenthetical notes)
          const targetMatch = item.match(/→\s*(.+)$/)
          const targetTitle = targetMatch?.[1]?.replace(/\s*\(.*\)\s*$/, '')?.trim() || ''
          return { label, targetTitle, href: `/${label.toLowerCase().replace(/\s+/g, '-')}` }
        })
        .filter((item) => !item.href.includes('settings') && !item.href.includes('admin'))
    : []

  // Build routes by matching nav targets to roadmap section IDs
  return parsedNavItems.map((navItem) => {
    // Find matching section — every condition must compare against the section's title
    const matchedSection = roadmapSections.find((s) => {
      const sTitle = s.title.toLowerCase()
      const target = navItem.targetTitle.toLowerCase()
      const label = navItem.label.toLowerCase()
      // Exact match on target title
      if (target && sTitle === target) return true
      // Section title starts with the nav label (e.g. "product catalog".startsWith("product"))
      if (label && sTitle.startsWith(label)) return true
      // Section title contains the nav label (e.g. "dashboard & reporting".includes("dashboard"))
      if (label && sTitle.includes(label)) return true
      return false
    })

    if (!matchedSection) {
      return { label: navItem.label, href: navItem.href, sectionId: null, screenDesignName: null }
    }

    // Find the first available screen design for this section
    const screenDesigns = getSectionScreenDesigns(matchedSection.id)
    const firstDesign = screenDesigns[0]?.name || null

    return {
      label: navItem.label,
      href: navItem.href,
      sectionId: matchedSection.id,
      screenDesignName: firstDesign,
    }
  })
}

/**
 * Lazily load a screen design component by section ID and name
 */
function lazyLoadScreenDesign(sectionId: string, designName: string): React.LazyExoticComponent<ComponentType> {
  return React.lazy(async () => {
    const loader = loadScreenDesignComponent(sectionId, designName)
    if (!loader) {
      return { default: () => <div className="p-8 text-slate-500">Screen design not found: {designName}</div> }
    }
    try {
      const module = await loader()
      if (module && typeof module.default === 'function') {
        return module
      }
      return { default: () => <div className="p-8 text-slate-500">Invalid screen design: {designName}</div> }
    } catch (e) {
      console.error('Failed to load screen design:', designName, e)
      return { default: () => <div className="p-8 text-slate-500">Failed to load: {designName}</div> }
    }
  })
}

/**
 * Fullscreen version of a screen design (for screenshots and interactive preview).
 * Always wraps content in the AppShell with working navigation between sections.
 * Syncs theme with parent window via localStorage.
 */
export function ScreenDesignFullscreen() {
  const { sectionId: initialSectionId, screenDesignName: initialScreenDesignName } = useParams<{
    sectionId: string
    screenDesignName: string
  }>()

  // Active section + screen design state — starts from URL params
  const [activeSectionId, setActiveSectionId] = useState(initialSectionId || '')
  const [activeScreenDesign, setActiveScreenDesign] = useState(initialScreenDesignName || '')

  // Build nav routes once
  const navRoutes = useMemo(() => buildNavRoutes(), [])

  // Find which nav route matches the active section
  const activeNavHref = useMemo(() => {
    const route = navRoutes.find((r) => r.sectionId === activeSectionId)
    return route?.href || ''
  }, [navRoutes, activeSectionId])

  // Build navigation items with correct isActive state
  const navigationItems = useMemo(
    () =>
      navRoutes.map((route) => ({
        label: route.label,
        href: route.href,
        isActive: route.href === activeNavHref,
      })),
    [navRoutes, activeNavHref]
  )

  // Handle sidebar navigation
  const handleNavigate = useCallback(
    (href: string) => {
      const route = navRoutes.find((r) => r.href === href)
      if (route?.sectionId && route?.screenDesignName) {
        setActiveSectionId(route.sectionId)
        setActiveScreenDesign(route.screenDesignName)
      }
    },
    [navRoutes]
  )

  // Lazily load the active screen design component
  const ActiveScreenDesign = useMemo(() => {
    if (!activeSectionId || !activeScreenDesign) return null
    return lazyLoadScreenDesign(activeSectionId, activeScreenDesign)
  }, [activeSectionId, activeScreenDesign])

  // Load AppShell component (always, for cross-section nav)
  const AppShellComponent = useMemo(() => {
    const shellExists = hasShellComponents()
    if (!shellExists) return null

    const loader = loadAppShell()
    if (!loader) return null

    return React.lazy(async () => {
      try {
        const module = (await loader()) as Record<string, unknown>
        const ShellComponent = (module?.default || module?.AppShell) as React.ComponentType<Record<string, unknown>>

        if (typeof ShellComponent !== 'function') {
          return { default: ({ children }: { children?: React.ReactNode }) => <>{children}</> }
        }

        return { default: ShellComponent as ComponentType<Record<string, unknown>> }
      } catch (e) {
        console.error('[ScreenDesignFullscreen] Failed to load AppShell:', e)
        return { default: ({ children }: { children?: React.ReactNode }) => <>{children}</> }
      }
    })
  }, [])

  // Sync theme with parent window
  useEffect(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem('theme') || 'system'
      const root = document.documentElement

      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', systemDark)
      } else {
        root.classList.toggle('dark', theme === 'dark')
      }
    }

    applyTheme()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') applyTheme()
    }
    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(applyTheme, 100)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (!ActiveScreenDesign) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-stone-600 dark:text-stone-400">Screen design not found.</p>
      </div>
    )
  }

  const content = (
    <Suspense
      fallback={
        <div className="h-full flex items-center justify-center">
          <div className="text-stone-500 dark:text-stone-400">Loading...</div>
        </div>
      }
    >
      <ActiveScreenDesign />
    </Suspense>
  )

  // Wrap in shell if available
  if (AppShellComponent) {
    return (
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center bg-background">
            <div className="text-stone-500 dark:text-stone-400">Loading...</div>
          </div>
        }
      >
        <AppShellComponent
          navigationItems={navigationItems}
          user={{ name: 'Demo User' }}
          productName="Centric PLM"
          productIcon="C"
          onNavigate={handleNavigate}
          onLogout={() => {}}
          onSettings={() => {}}
        >
          {content}
        </AppShellComponent>
      </Suspense>
    )
  }

  // No shell, render directly
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-background">
          <div className="text-stone-500 dark:text-stone-400">Loading...</div>
        </div>
      }
    >
      <ActiveScreenDesign />
    </Suspense>
  )
}
