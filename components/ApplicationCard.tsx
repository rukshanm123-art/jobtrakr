'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Banknote, ExternalLink, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { Application, STATUS_CONFIG } from '@/lib/types'
import { StatusBadge } from './StatusBadge'

export function ApplicationCard({ app, index }: { app: Application; index: number }) {
  const cfg = STATUS_CONFIG[app.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link href={`/applications/${app.id}`}>
        <div className="group relative overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 transition-shadow hover:shadow-md dark:hover:shadow-stone-900">
          {/* left accent bar */}
          <div
            className="absolute left-0 top-0 h-full w-0.5"
            style={{ backgroundColor: cfg.color }}
          />

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {/* Company */}
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: cfg.color }}
                >
                  {app.company[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 truncate">
                    {app.company}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{app.role}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                {app.location && (
                  <span className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
                    <MapPin className="h-3 w-3" />
                    {app.location}
                  </span>
                )}
                {app.salary && (
                  <span className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
                    <Banknote className="h-3 w-3" />
                    {app.salary}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(app.appliedAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <StatusBadge status={app.status} />
              {app.jobUrl && (
                <a
                  href={app.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-[10px] text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Job post
                </a>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
