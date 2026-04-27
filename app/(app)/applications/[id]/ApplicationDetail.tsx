'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import Link from 'next/link'
import {
  ArrowLeft, MapPin, Banknote, ExternalLink, Calendar,
  Pencil, Trash2, X, Check,
} from 'lucide-react'
import { StatusBadge } from '@/components/StatusBadge'
import { Timeline } from '@/components/Timeline'
import { ApplicationForm } from '@/components/ApplicationForm'
import { ALL_STATUSES, STATUS_CONFIG, type Application, type Status } from '@/lib/types'

export function ApplicationDetail({ application }: { application: Application }) {
  const router = useRouter()
  const [app, setApp] = useState(application)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const dark = mounted && resolvedTheme === 'dark'

  async function quickStatus(status: Status) {
    setUpdatingStatus(true)
    const res = await fetch(`/api/applications/${app.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const updated = await res.json()
    setApp(updated)
    setUpdatingStatus(false)
  }

  async function deleteApp() {
    await fetch(`/api/applications/${app.id}`, { method: 'DELETE' })
    router.push('/applications')
    router.refresh()
  }

  const meta = [
    app.location && { icon: MapPin, text: app.location },
    app.salary && { icon: Banknote, text: app.salary },
    { icon: Calendar, text: `Applied ${format(new Date(app.appliedAt), 'MMM d, yyyy')}` },
  ].filter(Boolean) as { icon: React.ElementType; text: string }[]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back */}
      <Link href="/applications" className="mb-6 flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors w-fit">
        <ArrowLeft className="h-3.5 w-3.5" /> All applications
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: detail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: STATUS_CONFIG[app.status].color }}
                >
                  {app.company[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{app.company}</h1>
                  <p className="text-sm text-stone-500 dark:text-stone-400">{app.role}</p>
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
              {meta.map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                  <Icon className="h-3.5 w-3.5" />
                  {text}
                </span>
              ))}
              {app.jobUrl && (
                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Job posting
                </a>
              )}
            </div>

            {app.notes && (
              <div className="mt-4 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-100 dark:border-stone-700 p-3">
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">Notes</p>
                <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">{app.notes}</p>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className="flex items-center gap-1.5 rounded-lg border border-stone-200 dark:border-stone-700 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              <button
                onClick={() => setDeleting(true)}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          </motion.div>

          {/* Edit form */}
          <AnimatePresence>
            {editing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Edit Application</h2>
                    <button onClick={() => setEditing(false)}>
                      <X className="h-4 w-4 text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100" />
                    </button>
                  </div>
                  <ApplicationForm
                    application={app}
                    onSuccess={(updated) => { setApp(updated); setEditing(false) }}
                    onCancel={() => setEditing(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: status + timeline */}
        <div className="space-y-4">
          {/* Quick status update */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4"
          >
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">Update Status</h2>
            <div className="space-y-1">
              {ALL_STATUSES.map((s) => {
                const cfg = STATUS_CONFIG[s]
                const active = app.status === s
                return (
                  <button
                    key={s}
                    disabled={active || updatingStatus}
                    onClick={() => quickStatus(s)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors ${active ? 'cursor-default' : 'hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                    style={
                      active
                        ? { backgroundColor: dark ? cfg.darkBg : cfg.bg, color: cfg.color }
                        : { color: dark ? '#78716c' : '#6B7280' }
                    }
                  >
                    <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                    {cfg.label}
                    {active && <Check className="ml-auto h-3 w-3" />}
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Timeline */}
          {app.events && app.events.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4"
            >
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">Timeline</h2>
              <Timeline events={app.events!} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-80 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-6 shadow-xl"
            >
              <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Delete application?</h2>
              <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
                This will permanently remove <strong>{app.company}</strong> — <strong>{app.role}</strong> and all its history.
              </p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setDeleting(false)} className="flex-1 rounded-lg border border-stone-200 dark:border-stone-700 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                  Cancel
                </button>
                <button onClick={deleteApp} className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
