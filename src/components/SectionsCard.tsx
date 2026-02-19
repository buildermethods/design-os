import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import type { ProductRoadmap } from '@/types/product'

interface SectionsCardProps {
  roadmap: ProductRoadmap
  onSectionClick: (sectionId: string) => void
}

export function SectionsCard({ roadmap, onSectionClick }: SectionsCardProps) {
  return (
    <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Sections
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-stone-200 dark:divide-stone-700">
          {roadmap.sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionClick(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs font-medium flex items-center justify-center">
                    {section.order}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-medium text-stone-900 dark:text-stone-100 truncate">
                      {section.title}
                    </h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                      {section.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 dark:text-stone-500 flex-shrink-0" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
