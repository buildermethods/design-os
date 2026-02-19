import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ProductStatus, Priority } from '@/../product/sections/product-catalog/types'

const statusStyles: Record<ProductStatus, string> = {
  Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  Development: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  'In Review': 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Manufacturing: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
  Archived: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500',
}

const statusDots: Record<ProductStatus, string> = {
  Draft: 'bg-slate-400',
  Development: 'bg-blue-500',
  'In Review': 'bg-amber-500',
  Approved: 'bg-emerald-500',
  Manufacturing: 'bg-violet-500',
  Archived: 'bg-slate-400',
}

const priorityStyles: Record<Priority, string> = {
  P1: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20',
  P2: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
  P3: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
}

interface StatusBadgeProps {
  status: ProductStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'gap-1.5',
        statusStyles[status] || statusStyles.Draft,
        size === 'md' ? 'px-2.5 py-1' : 'px-2 py-0.5'
      )}
    >
      <span
        className={cn('size-1.5 rounded-full', statusDots[status] || statusDots.Draft)}
      />
      {status}
    </Badge>
  )
}

interface PriorityBadgeProps {
  priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider',
        priorityStyles[priority] || priorityStyles.P3
      )}
    >
      {priority}
    </Badge>
  )
}
