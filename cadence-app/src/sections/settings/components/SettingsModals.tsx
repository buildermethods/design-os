import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type {
  DropReasonCategory,
  DropReasonFormData,
  Pipeline,
  PipelineFormData,
  StageColor,
  StageFormData,
  StageType,
  UserFormData,
  UserRole,
} from '../types'

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

function Modal({ title, onClose, children }: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-slate-900 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

const selectCls = inputCls

function SubmitRow({ onClose, submitLabel }: { onClose: () => void; submitLabel: string }) {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
      >
        {submitLabel}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pipeline Modal
// ---------------------------------------------------------------------------

interface PipelineModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialData?: PipelineFormData
  onClose: () => void
  onSubmit: (data: PipelineFormData) => void
}

export function PipelineModal({ open, mode, initialData, onClose, onSubmit }: PipelineModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? '')
      setDescription(initialData?.description ?? '')
    }
  }, [open, initialData])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), description: description.trim() })
    onClose()
  }

  return (
    <Modal title={mode === 'create' ? 'New Pipeline' : 'Edit Pipeline'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 space-y-4">
          <Field label="Pipeline name *">
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. NEET Coaching 2025"
              autoFocus
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What kind of leads go through this pipeline?"
            />
          </Field>
        </div>
        <SubmitRow onClose={onClose} submitLabel={mode === 'create' ? 'Create Pipeline' : 'Save Changes'} />
      </form>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Stage Modal
// ---------------------------------------------------------------------------

const STAGE_COLORS: StageColor[] = ['slate', 'blue', 'indigo', 'violet', 'amber', 'emerald', 'rose']
const COLOR_BG: Record<StageColor, string> = {
  slate: 'bg-slate-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  rose: 'bg-rose-500',
}

interface StageModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialData?: StageFormData
  onClose: () => void
  onSubmit: (data: StageFormData) => void
}

export function StageModal({ open, mode, initialData, onClose, onSubmit }: StageModalProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<StageType>('open')
  const [color, setColor] = useState<StageColor>('slate')
  const [isHot, setIsHot] = useState(false)

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? '')
      setType(initialData?.type ?? 'open')
      setColor(initialData?.color ?? 'slate')
      setIsHot(initialData?.isHot ?? false)
    }
  }, [open, initialData])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), type, color, isHot })
    onClose()
  }

  return (
    <Modal title={mode === 'create' ? 'New Stage' : 'Edit Stage'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 space-y-4">
          <Field label="Stage name *">
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Demo Scheduled"
              autoFocus
              required
            />
          </Field>
          <Field label="Stage type">
            <select
              className={selectCls}
              value={type}
              onChange={(e) => setType(e.target.value as StageType)}
            >
              <option value="open">Open — lead is in progress</option>
              <option value="won">Won — lead converted</option>
              <option value="lost">Lost — lead dropped</option>
            </select>
          </Field>
          <Field label="Color">
            <div className="flex gap-2">
              {STAGE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full ${COLOR_BG[c]} transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900' : 'hover:scale-110'}`}
                  aria-label={c}
                />
              ))}
            </div>
          </Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isHot}
              onChange={(e) => setIsHot(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Mark as Hot stage</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Leads in this stage count toward Hot Leads metric</p>
            </div>
          </label>
        </div>
        <SubmitRow onClose={onClose} submitLabel={mode === 'create' ? 'Create Stage' : 'Save Changes'} />
      </form>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Drop Reason Modal
// ---------------------------------------------------------------------------

const DROP_REASON_CATEGORIES: { id: DropReasonCategory; label: string }[] = [
  { id: 'pricing', label: 'Pricing' },
  { id: 'timing', label: 'Timing' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'competitor', label: 'Competitor' },
  { id: 'noResponse', label: 'No Response' },
  { id: 'other', label: 'Other' },
]

interface DropReasonModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialData?: DropReasonFormData
  onClose: () => void
  onSubmit: (data: DropReasonFormData) => void
}

export function DropReasonModal({ open, mode, initialData, onClose, onSubmit }: DropReasonModalProps) {
  const [reason, setReason] = useState('')
  const [category, setCategory] = useState<DropReasonCategory>('other')

  useEffect(() => {
    if (open) {
      setReason(initialData?.reason ?? '')
      setCategory(initialData?.category ?? 'other')
    }
  }, [open, initialData])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return
    onSubmit({ reason: reason.trim(), category })
    onClose()
  }

  return (
    <Modal title={mode === 'create' ? 'New Drop Reason' : 'Edit Drop Reason'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 space-y-4">
          <Field label="Reason *">
            <input
              className={inputCls}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Price too high"
              autoFocus
              required
            />
          </Field>
          <Field label="Category">
            <select
              className={selectCls}
              value={category}
              onChange={(e) => setCategory(e.target.value as DropReasonCategory)}
            >
              {DROP_REASON_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </Field>
        </div>
        <SubmitRow onClose={onClose} submitLabel={mode === 'create' ? 'Create Reason' : 'Save Changes'} />
      </form>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Invite User Modal
// ---------------------------------------------------------------------------

interface InviteUserModalProps {
  open: boolean
  pipelines: Pipeline[]
  onClose: () => void
  onSubmit: (data: UserFormData) => void
}

export function InviteUserModal({ open, pipelines, onClose, onSubmit }: InviteUserModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('bd')
  const [assignedPipelineIds, setAssignedPipelineIds] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setName('')
      setEmail('')
      setRole('bd')
      setAssignedPipelineIds([])
    }
  }, [open])

  if (!open) return null

  const togglePipeline = (id: string) => {
    setAssignedPipelineIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    onSubmit({ name: name.trim(), email: email.trim(), role, assignedPipelineIds })
    onClose()
  }

  const activePipelines = pipelines.filter((p) => !p.archivedAt)

  return (
    <Modal title="Invite Team Member" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 space-y-4">
          <Field label="Full name *">
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              autoFocus
              required
            />
          </Field>
          <Field label="Email *">
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@yourorg.com"
              required
            />
          </Field>
          <Field label="Role">
            <select
              className={selectCls}
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="bd">BD — makes calls, logs outcomes</option>
              <option value="admin">Admin — manages settings, views all data</option>
              <option value="founder">Founder — full access</option>
            </select>
          </Field>
          {activePipelines.length > 0 && (
            <Field label="Assigned pipelines">
              <div className="space-y-2">
                {activePipelines.map((p) => (
                  <label key={p.id} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assignedPipelineIds.includes(p.id)}
                      onChange={() => togglePipeline(p.id)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{p.name}</span>
                  </label>
                ))}
              </div>
            </Field>
          )}
        </div>
        <SubmitRow onClose={onClose} submitLabel="Send Invite" />
      </form>
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Edit User Modal
// ---------------------------------------------------------------------------

interface EditUserModalProps {
  open: boolean
  userName?: string
  initialRole?: UserRole
  initialPipelineIds?: string[]
  pipelines: Pipeline[]
  onClose: () => void
  onSubmit: (data: Pick<UserFormData, 'role' | 'assignedPipelineIds'>) => void
}

export function EditUserModal({
  open,
  userName,
  initialRole,
  initialPipelineIds,
  pipelines,
  onClose,
  onSubmit,
}: EditUserModalProps) {
  const [role, setRole] = useState<UserRole>('bd')
  const [assignedPipelineIds, setAssignedPipelineIds] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setRole(initialRole ?? 'bd')
      setAssignedPipelineIds(initialPipelineIds ?? [])
    }
  }, [open, initialRole, initialPipelineIds])

  if (!open) return null

  const togglePipeline = (id: string) => {
    setAssignedPipelineIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ role, assignedPipelineIds })
    onClose()
  }

  const activePipelines = pipelines.filter((p) => !p.archivedAt)

  return (
    <Modal title={userName ? `Edit ${userName}` : 'Edit User'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-5 space-y-4">
          <Field label="Role">
            <select
              className={selectCls}
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="bd">BD — makes calls, logs outcomes</option>
              <option value="admin">Admin — manages settings, views all data</option>
              <option value="founder">Founder — full access</option>
            </select>
          </Field>
          {activePipelines.length > 0 && (
            <Field label="Assigned pipelines">
              <div className="space-y-2">
                {activePipelines.map((p) => (
                  <label key={p.id} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assignedPipelineIds.includes(p.id)}
                      onChange={() => togglePipeline(p.id)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{p.name}</span>
                  </label>
                ))}
              </div>
            </Field>
          )}
        </div>
        <SubmitRow onClose={onClose} submitLabel="Save Changes" />
      </form>
    </Modal>
  )
}
