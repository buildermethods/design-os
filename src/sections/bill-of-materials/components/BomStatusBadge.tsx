import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { BomStatus, BomTypeName } from '@/../product/sections/bill-of-materials/types'

const statusStyles: Record<string, string> = {
  Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  'In Review': 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Locked: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  Archived: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500',
}

const statusDots: Record<string, string> = {
  Draft: 'bg-slate-400',
  'In Review': 'bg-amber-500',
  Approved: 'bg-emerald-500',
  Locked: 'bg-blue-500',
  Archived: 'bg-slate-400',
}

const typeStyles: Record<string, string> = {
  Design: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 border-violet-200 dark:border-violet-500/20',
  Manufacturing: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
  Sourcing: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
  Assortment: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
}

interface BomStatusBadgeProps {
  status: BomStatus
  size?: 'sm' | 'md'
}

export function BomStatusBadge({ status, size = 'sm' }: BomStatusBadgeProps) {
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

interface BomTypeBadgeProps {
  type: BomTypeName
}

export function BomTypeBadge({ type }: BomTypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider',
        typeStyles[type] || 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
      )}
    >
      {type}
    </Badge>
  )
}

interface ApprovalStatusBadgeProps {
  status: 'Pending' | 'Approved' | 'Rejected' | 'Skipped'
}

const approvalStyles: Record<string, string> = {
  Pending: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
  Approved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Rejected: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  Skipped: 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
}

export function ApprovalStatusBadge({ status }: ApprovalStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(approvalStyles[status] || approvalStyles.Pending)}
    >
      {status}
    </Badge>
  )
}
