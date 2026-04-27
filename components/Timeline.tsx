'use client'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Event, STATUS_CONFIG } from '@/lib/types'

export function Timeline({ events }: { events: Event[] }) {
  return (
    <div className="relative space-y-3 pl-5">
      {/* vertical line */}
      <div className="absolute left-2 top-2 bottom-2 w-px bg-stone-200" />

      {events.map((ev, i) => {
        const cfg = STATUS_CONFIG[ev.status]
        return (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="relative flex gap-3 items-start"
          >
            {/* dot */}
            <div
              className="absolute -left-5 mt-1 h-3 w-3 rounded-full border-2 border-white ring-1"
              style={{ backgroundColor: cfg.color }}
            />
            <div className="flex-1 rounded-lg border border-stone-100 bg-stone-50 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-xs font-medium"
                  style={{ color: cfg.color }}
                >
                  {cfg.label}
                </span>
                <span className="text-[10px] text-stone-400">
                  {format(new Date(ev.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              {ev.note && (
                <p className="mt-1 text-xs text-stone-500">{ev.note}</p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
