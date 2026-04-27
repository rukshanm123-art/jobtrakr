'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Building2, BriefcaseBusiness, MapPin, Banknote, Link2, FileText, Calendar } from 'lucide-react'
import { ALL_STATUSES, STATUS_CONFIG, Status } from '@/lib/types'
import type { Application } from '@/lib/types'

interface Props {
  application?: Application
  onSuccess?: () => void
}

export function ApplicationForm({ application, onSuccess }: Props) {
  const router = useRouter()
  const isEdit = !!application
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    company: application?.company ?? '',
    role: application?.role ?? '',
    location: application?.location ?? '',
    salary: application?.salary ?? '',
    jobUrl: application?.jobUrl ?? '',
    status: (application?.status ?? 'APPLIED') as Status,
    notes: application?.notes ?? '',
    appliedAt: application?.appliedAt
      ? new Date(application.appliedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    eventNote: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        isEdit ? `/api/applications/${application!.id}` : '/api/applications',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error ?? 'Something went wrong')
      }
      const saved = await res.json()
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/applications/${saved.id}`)
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({
    label, icon: Icon, children,
  }: { label: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-stone-700">
        <Icon className="h-3 w-3" />
        {label}
      </label>
      {children}
    </div>
  )

  const inputCls = 'w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 placeholder-stone-400 outline-none transition focus:border-stone-400 focus:bg-white'

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Company *" icon={Building2}>
          <input required className={inputCls} placeholder="Google" value={form.company} onChange={set('company')} />
        </Field>
        <Field label="Role *" icon={BriefcaseBusiness}>
          <input required className={inputCls} placeholder="Software Engineer" value={form.role} onChange={set('role')} />
        </Field>
        <Field label="Location" icon={MapPin}>
          <input className={inputCls} placeholder="Auckland, NZ / Remote" value={form.location} onChange={set('location')} />
        </Field>
        <Field label="Salary" icon={Banknote}>
          <input className={inputCls} placeholder="$120k – $150k" value={form.salary} onChange={set('salary')} />
        </Field>
        <Field label="Applied Date" icon={Calendar}>
          <input type="date" className={inputCls} value={form.appliedAt} onChange={set('appliedAt')} />
        </Field>
        <Field label="Status" icon={BriefcaseBusiness}>
          <select
            className={inputCls}
            value={form.status}
            onChange={set('status') as React.ChangeEventHandler<HTMLSelectElement>}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Job Posting URL" icon={Link2}>
        <input type="url" className={inputCls} placeholder="https://..." value={form.jobUrl} onChange={set('jobUrl')} />
      </Field>

      <Field label="Notes" icon={FileText}>
        <textarea
          rows={4}
          className={inputCls + ' resize-none'}
          placeholder="Recruiter name, interview prep, anything relevant..."
          value={form.notes}
          onChange={set('notes')}
        />
      </Field>

      {isEdit && (
        <Field label="Update Note (optional)" icon={FileText}>
          <input className={inputCls} placeholder="e.g. Completed take-home test" value={form.eventNote} onChange={set('eventNote')} />
        </Field>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 border border-red-200">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Application'}
        </button>
      </div>
    </motion.form>
  )
}
