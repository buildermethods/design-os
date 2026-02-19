import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, Layout } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import type { ScreenDesignInfo } from '@/types/section'

interface ScreenDesignsCardProps {
  screenDesigns: ScreenDesignInfo[]
  sectionId: string
}

export function ScreenDesignsCard({ screenDesigns, sectionId }: ScreenDesignsCardProps) {
  // Empty state
  if (screenDesigns.length === 0) {
    return <EmptyState type="screen-designs" />
  }

  return (
    <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Screen Designs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-stone-200 dark:divide-stone-700">
          {screenDesigns.map((screenDesign) => (
            <li key={screenDesign.name}>
              <Link
                to={`/sections/${sectionId}/screen-designs/${screenDesign.name}`}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-stone-200 dark:bg-stone-700 flex items-center justify-center shrink-0">
                    <Layout className="w-4 h-4 text-stone-600 dark:text-stone-300" strokeWidth={1.5} />
                  </div>
                  <span className="font-medium text-stone-900 dark:text-stone-100 truncate">
                    {screenDesign.name}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0" strokeWidth={1.5} />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
