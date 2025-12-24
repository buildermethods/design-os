import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, CheckCircle2, AlertCircle, XCircle, Circle } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import type { AccessibilityInfo } from '@/types/section'

interface AccessibilityCardProps {
  accessibility: AccessibilityInfo | null
}

function getStatusIcon(status: 'pass' | 'warning' | 'fail' | 'not-checked') {
  switch (status) {
    case 'pass':
      return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" strokeWidth={1.5} />
    case 'warning':
      return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" strokeWidth={1.5} />
    case 'fail':
      return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" strokeWidth={1.5} />
    default:
      return <Circle className="w-4 h-4 text-stone-400 dark:text-stone-500" strokeWidth={1.5} />
  }
}

function getStatusLabel(status: 'pass' | 'warning' | 'fail' | 'not-checked') {
  switch (status) {
    case 'pass':
      return 'Pass'
    case 'warning':
      return 'Warning'
    case 'fail':
      return 'Fail'
    default:
      return 'Not checked'
  }
}

function getComplianceSummary(checklist: AccessibilityInfo['checklist']) {
  const byLevel = {
    A: checklist.filter(item => item.level === 'A'),
    AA: checklist.filter(item => item.level === 'AA'),
    AAA: checklist.filter(item => item.level === 'AAA'),
  }

  const passed = {
    A: byLevel.A.filter(item => item.status === 'pass').length,
    AA: byLevel.AA.filter(item => item.status === 'pass').length,
    AAA: byLevel.AAA.filter(item => item.status === 'pass').length,
  }

  const total = {
    A: byLevel.A.length,
    AA: byLevel.AA.length,
    AAA: byLevel.AAA.length,
  }

  return { passed, total, byLevel }
}

export function AccessibilityCard({ accessibility }: AccessibilityCardProps) {
  const [reportOpen, setReportOpen] = useState(false)
  const [levelAOpen, setLevelAOpen] = useState(true)
  const [levelAAOpen, setLevelAAOpen] = useState(false)
  const [levelAAAOpen, setLevelAAAOpen] = useState(false)

  // Empty state
  if (!accessibility) {
    return <EmptyState type="accessibility" />
  }

  const summary = getComplianceSummary(accessibility.checklist)

  return (
    <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Accessibility
          </CardTitle>
          {accessibility.lastAnalyzed && (
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Analyzed {new Date(accessibility.lastAnalyzed).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compliance Summary */}
        {accessibility.checklist.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3">
              <div className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">
                Level A
              </div>
              <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                {summary.passed.A}/{summary.total.A}
              </div>
            </div>
            <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3">
              <div className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">
                Level AA
              </div>
              <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                {summary.passed.AA}/{summary.total.AA}
              </div>
            </div>
            <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3">
              <div className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">
                Level AAA
              </div>
              <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                {summary.passed.AAA}/{summary.total.AAA}
              </div>
            </div>
          </div>
        )}

        {/* WCAG Checklist by Level */}
        {summary.byLevel.A.length > 0 && (
          <Collapsible open={levelAOpen} onOpenChange={setLevelAOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left group">
              <span className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                Level A (Basic Requirements)
                <span className="ml-2 text-stone-400 dark:text-stone-500 normal-case tracking-normal">
                  ({summary.passed.A}/{summary.total.A} passed)
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform ${
                  levelAOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="space-y-2 pt-2">
                {summary.byLevel.A.map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-stone-700 dark:text-stone-300 text-sm">
                        {item.description}
                      </span>
                      {item.screen && (
                        <span className="ml-2 text-xs text-stone-500 dark:text-stone-400">
                          ({item.screen})
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {summary.byLevel.AA.length > 0 && (
          <Collapsible open={levelAAOpen} onOpenChange={setLevelAAOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left group">
              <span className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                Level AA (Standard Requirements)
                <span className="ml-2 text-stone-400 dark:text-stone-500 normal-case tracking-normal">
                  ({summary.passed.AA}/{summary.total.AA} passed)
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform ${
                  levelAAOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="space-y-2 pt-2">
                {summary.byLevel.AA.map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-stone-700 dark:text-stone-300 text-sm">
                        {item.description}
                      </span>
                      {item.screen && (
                        <span className="ml-2 text-xs text-stone-500 dark:text-stone-400">
                          ({item.screen})
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {summary.byLevel.AAA.length > 0 && (
          <Collapsible open={levelAAAOpen} onOpenChange={setLevelAAAOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-left group">
              <span className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                Level AAA (Enhanced Requirements)
                <span className="ml-2 text-stone-400 dark:text-stone-500 normal-case tracking-normal">
                  ({summary.passed.AAA}/{summary.total.AAA} passed)
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform ${
                  levelAAAOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="space-y-2 pt-2">
                {summary.byLevel.AAA.map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {getStatusIcon(item.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-stone-700 dark:text-stone-300 text-sm">
                        {item.description}
                      </span>
                      {item.screen && (
                        <span className="ml-2 text-xs text-stone-500 dark:text-stone-400">
                          ({item.screen})
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Full Report - Collapsible */}
        {accessibility.report && (
          <Collapsible open={reportOpen} onOpenChange={setReportOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-left group">
              <ChevronDown
                className={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform ${
                  reportOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
              <span className="text-xs text-stone-500 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
                {reportOpen ? 'Hide' : 'View'} Full Report
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="bg-stone-50 dark:bg-stone-900 rounded-md p-4 overflow-x-auto mt-3">
                <pre className="text-xs font-mono text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                  {accessibility.report}
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}

