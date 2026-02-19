import { useMemo } from 'react'
import { Check, AlertTriangle, FileText, FolderTree, ChevronDown, Download, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { AppLayout } from '@/components/AppLayout'
import { loadProductData, hasExportZip, getExportZipUrl } from '@/lib/product-loader'
import { getAllSectionIds, getSectionScreenDesigns } from '@/lib/section-loader'

export function ExportPage() {
  const productData = useMemo(() => loadProductData(), [])

  // Get section stats
  const sectionStats = useMemo(() => {
    const allSectionIds = getAllSectionIds()
    const sectionCount = productData.roadmap?.sections.length || 0
    const sectionsWithScreenDesigns = allSectionIds.filter(id => {
      const screenDesigns = getSectionScreenDesigns(id)
      return screenDesigns.length > 0
    }).length
    return { sectionCount, sectionsWithScreenDesigns, allSectionIds }
  }, [productData.roadmap])

  const hasOverview = !!productData.overview
  const hasRoadmap = !!productData.roadmap
  const hasDataModel = !!productData.dataModel
  const hasDesignSystem = !!productData.designSystem
  const hasShell = !!productData.shell
  const hasSections = sectionStats.sectionsWithScreenDesigns > 0

  const requiredComplete = hasOverview && hasRoadmap && hasSections

  // Check for export zip
  const exportZipAvailable = hasExportZip()
  const exportZipUrl = getExportZipUrl()

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            {exportZipAvailable ? 'Ready for implementation!' : 'Export'}
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            {exportZipAvailable
              ? 'Download your product design package and implement it in your codebase using the provided handoff prompts and assets.'
              : 'Generate a complete handoff package for your development team.'}
          </p>
        </div>

        {/* Status - only show if zip not available */}
        {!exportZipAvailable && (
          <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                {requiredComplete ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-lime-600 dark:text-lime-400" strokeWidth={2.5} />
                    </div>
                    Ready to Export
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" strokeWidth={2.5} />
                    </div>
                    Not Ready
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <ChecklistItem label="Product Overview" isComplete={hasOverview} />
                <ChecklistItem label="Product Roadmap" isComplete={hasRoadmap} />
                <ChecklistItem label="Data Model" isComplete={hasDataModel} />
                <ChecklistItem label="Design System" isComplete={hasDesignSystem} />
                <ChecklistItem label="Application Shell" isComplete={hasShell} />
                <ChecklistItem
                  label={`Sections with screen designs (${sectionStats.sectionsWithScreenDesigns}/${sectionStats.sectionCount})`}
                  isComplete={hasSections}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Export command */}
        {requiredComplete && (
          <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                {exportZipAvailable ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-lime-600 dark:text-lime-400" strokeWidth={2.5} />
                    </div>
                    Export Package is Ready
                  </>
                ) : (
                  'Generate Export Package'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {exportZipAvailable && exportZipUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-lime-50 dark:bg-lime-900/20 rounded-lg border border-lime-200 dark:border-lime-800">
                    <div className="w-10 h-10 rounded-full bg-lime-100 dark:bg-lime-900/40 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-lime-600 dark:text-lime-400" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-900 dark:text-stone-100">
                        Download & use in your codebase
                      </p>
                      <p className="text-sm text-stone-500 dark:text-stone-400">
                        product-plan.zip
                      </p>
                    </div>
                    <a
                      href={exportZipUrl}
                      download="product-plan.zip"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white font-medium text-sm rounded-md transition-colors shrink-0"
                    >
                      <Download className="w-4 h-4" strokeWidth={2} />
                      Download
                    </a>
                  </div>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    To regenerate, run <code className="font-mono text-stone-700 dark:text-stone-300">/export-product</code> again.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-stone-600 dark:text-stone-400">
                    Run the following command to generate a complete export package with all components, types, and handoff documentation:
                  </p>
                  <div className="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-3">
                    <code className="text-sm font-mono text-stone-800 dark:text-stone-200">
                      /export-product
                    </code>
                  </div>
                </div>
              )}

              {/* What's included */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                <h4 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <FolderTree className="w-4 h-4" strokeWidth={1.5} />
                  What's Included
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <ExportItem
                    title="Ready-to-Use Prompts"
                    description="Pre-written prompts to copy/paste into your coding agent."
                    items={['one-shot-prompt.md', 'section-prompt.md']}
                  />
                  <ExportItem
                    title="Instructions"
                    description="Detailed implementation guides for your coding agent."
                    items={['product-overview.md', 'one-shot-instructions.md', 'incremental/ (milestones)']}
                  />
                  <ExportItem
                    title="Design System"
                    description="Colors, typography, and styling configuration for consistent branding."
                    items={['CSS tokens', 'Tailwind config', 'Font setup']}
                  />
                  <ExportItem
                    title="Data Model"
                    description="Entity definitions and sample data for your application."
                    items={['TypeScript types', 'Sample data', 'Entity docs']}
                  />
                  <ExportItem
                    title="Components"
                    description="React components and visual references for each section."
                    items={['Shell components', 'Section components', 'Screenshots']}
                  />
                  <ExportItem
                    title="Test Instructions"
                    description="Framework-agnostic test specs for TDD implementation."
                    items={['tests.md per section', 'User flow tests', 'Empty state tests']}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* How to use */}
        <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-stone-500 dark:text-stone-400" strokeWidth={1.5} />
              How to Use the Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Option A - Incremental (Recommended) */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-start justify-between w-full text-left group">
                <div className="flex-1">
                  <h4 className="font-medium text-stone-900 dark:text-stone-100">
                    Option A: Incremental (Recommended)
                  </h4>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                    Build milestone by milestone for better control and easier debugging.
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-stone-400 dark:text-stone-500 mt-1 shrink-0 transition-transform group-data-[state=open]:rotate-180" strokeWidth={1.5} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ol className="text-sm text-stone-600 dark:text-stone-400 space-y-2 list-decimal list-inside mt-4 pl-1">
                  <li>Copy the <code className="font-mono text-stone-800 dark:text-stone-200">product-plan/</code> folder into your codebase</li>
                  <li>Start with Foundation (<code className="font-mono text-stone-800 dark:text-stone-200">instructions/incremental/01-foundation.md</code>)</li>
                  <li>Then Shell (<code className="font-mono text-stone-800 dark:text-stone-200">instructions/incremental/02-shell.md</code>)</li>
                  <li>
                    For each section:
                    <ul className="mt-1.5 ml-5 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-stone-400 dark:bg-stone-500" />
                        Open <code className="font-mono text-stone-800 dark:text-stone-200">prompts/section-prompt.md</code>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-stone-400 dark:bg-stone-500" />
                        Fill in the section variables at the top (SECTION_NAME, SECTION_ID, NN)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-stone-400 dark:bg-stone-500" />
                        Copy/paste the prompt into your AI coding agent
                      </li>
                    </ul>
                  </li>
                  <li>Review and test after each milestone before moving to the next</li>
                </ol>
              </CollapsibleContent>
            </Collapsible>

            <div className="border-t border-stone-200 dark:border-stone-700" />

            {/* Option B - One-Shot */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-start justify-between w-full text-left group">
                <div className="flex-1">
                  <h4 className="font-medium text-stone-900 dark:text-stone-100">
                    Option B: One-Shot
                  </h4>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                    Build the entire app in one session using a pre-written prompt.
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-stone-400 dark:text-stone-500 mt-1 shrink-0 transition-transform group-data-[state=open]:rotate-180" strokeWidth={1.5} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ol className="text-sm text-stone-600 dark:text-stone-400 space-y-2 list-decimal list-inside mt-4 pl-1">
                  <li>Copy the <code className="font-mono text-stone-800 dark:text-stone-200">product-plan/</code> folder into your codebase</li>
                  <li>Open <code className="font-mono text-stone-800 dark:text-stone-200">prompts/one-shot-prompt.md</code></li>
                  <li>Add any additional notes to the prompt (tech stack preferences, etc.)</li>
                  <li>Copy/paste the prompt into your AI coding agent</li>
                  <li>Answer the agent's clarifying questions about auth, user modeling, etc.</li>
                  <li>Let the agent plan and implement everything</li>
                </ol>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

interface ChecklistItemProps {
  label: string
  isComplete: boolean
}

function ChecklistItem({ label, isComplete }: ChecklistItemProps) {
  return (
    <div className="flex items-center gap-2 py-1">
      {isComplete ? (
        <div className="w-4 h-4 rounded bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-stone-600 dark:text-stone-400" strokeWidth={3} />
        </div>
      ) : (
        <div className="w-4 h-4 rounded border-2 border-amber-400 dark:border-amber-500" />
      )}
      <span className="text-sm text-stone-700 dark:text-stone-300">
        {label}
      </span>
    </div>
  )
}

interface ExportItemProps {
  title: string
  description: string
  items: string[]
}

function ExportItem({ title, description, items }: ExportItemProps) {
  return (
    <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4">
      <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-1">{title}</h4>
      <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">{description}</p>
      <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-stone-400 dark:bg-stone-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
