import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { PhaseWarningBanner } from '@/components/PhaseWarningBanner'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'
import { getSectionScreenDesigns, getSectionScreenshots, hasSectionSpec, hasSectionData } from '@/lib/section-loader'
import { ChevronRight, Check, Circle } from 'lucide-react'

interface SectionProgress {
  hasSpec: boolean
  hasData: boolean
  hasScreenDesigns: boolean
  screenDesignCount: number
  hasScreenshots: boolean
  screenshotCount: number
}

function getSectionProgress(sectionId: string): SectionProgress {
  const screenDesigns = getSectionScreenDesigns(sectionId)
  const screenshots = getSectionScreenshots(sectionId)
  return {
    hasSpec: hasSectionSpec(sectionId),
    hasData: hasSectionData(sectionId),
    hasScreenDesigns: screenDesigns.length > 0,
    screenDesignCount: screenDesigns.length,
    hasScreenshots: screenshots.length > 0,
    screenshotCount: screenshots.length,
  }
}

export function SectionsPage() {
  const navigate = useNavigate()
  const productData = useMemo(() => loadProductData(), [])

  const sections = productData.roadmap?.sections || []

  // Calculate progress for each section
  const sectionProgressMap = useMemo(() => {
    const map: Record<string, SectionProgress> = {}
    for (const section of sections) {
      map[section.id] = getSectionProgress(section.id)
    }
    return map
  }, [sections])

  // Count completed sections (those with spec, data, AND screen designs)
  const completedSections = sections.filter(s => {
    const p = sectionProgressMap[s.id]
    return p?.hasSpec && p?.hasData && p?.hasScreenDesigns
  }).length

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Sections
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Design each section of your product with specifications, sample data, and screen designs.
          </p>
          {sections.length > 0 && (
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
              {completedSections} of {sections.length} sections completed
            </p>
          )}
        </div>

        {/* Warning banner for incomplete prerequisite phases */}
        <PhaseWarningBanner />

        {/* Sections list */}
        {sections.length === 0 ? (
          <EmptyState type="roadmap" />
        ) : (
          <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                All Sections
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-stone-200 dark:divide-stone-700">
                {sections.map((section) => {
                  const progress = sectionProgressMap[section.id]
                  const isComplete = progress?.hasSpec && progress?.hasData && progress?.hasScreenDesigns

                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => navigate(`/sections/${section.id}`)}
                        className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                      >
                        <div className="flex items-start gap-4 min-w-0">
                          {/* Status indicator */}
                          <div className="shrink-0 mt-0.5">
                            {isComplete ? (
                              <div className="w-6 h-6 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" strokeWidth={2.5} />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                                <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                                  {section.order}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-stone-900 dark:text-stone-100 truncate">
                              {section.title}
                            </h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                              {section.description}
                            </p>

                            {/* Progress indicators */}
                            <div className="flex items-center gap-3 mt-2">
                              <ProgressDot label="Spec" done={progress?.hasSpec} />
                              <ProgressDot label="Data" done={progress?.hasData} />
                              <ProgressDot
                                label={progress?.screenDesignCount ? `${progress.screenDesignCount} screen design${progress.screenDesignCount !== 1 ? 's' : ''}` : 'Screen Designs'}
                                done={progress?.hasScreenDesigns}
                              />
                              <ProgressDot
                                label={progress?.screenshotCount ? `${progress.screenshotCount} screenshot${progress.screenshotCount !== 1 ? 's' : ''}` : 'Screenshots'}
                                done={progress?.hasScreenshots}
                                optional
                              />
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-stone-400 dark:text-stone-500 flex-shrink-0" strokeWidth={1.5} />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Next Phase Button - shown when all sections are complete */}
        {sections.length > 0 && completedSections === sections.length && (
          <NextPhaseButton nextPhase="export" />
        )}
      </div>
    </AppLayout>
  )
}

interface ProgressDotProps {
  label: string
  done?: boolean
  optional?: boolean
}

function ProgressDot({ label, done, optional }: ProgressDotProps) {
  return (
    <span className={`flex items-center gap-1 text-xs ${
      done
        ? 'text-stone-700 dark:text-stone-300'
        : optional
          ? 'text-stone-300 dark:text-stone-600'
          : 'text-stone-400 dark:text-stone-500'
    }`}>
      {done ? (
        <Check className="w-3 h-3 text-lime-600 dark:text-lime-400" strokeWidth={2.5} />
      ) : (
        <Circle className={`w-3 h-3 ${optional ? 'opacity-50' : ''}`} strokeWidth={1.5} />
      )}
      {label}
    </span>
  )
}
