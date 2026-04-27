'use client'
import { motion } from 'framer-motion'
import { ACTIVE_STATUSES, STATUS_CONFIG } from '@/lib/types'

interface Props {
  counts: Record<string, number>
  total: number
}

export function Pipeline({ counts, total }: Props) {
  return (
    <div className="flex items-end gap-1.5 h-24">
      {ACTIVE_STATUSES.map((status, i) => {
        const cfg = STATUS_CONFIG[status]
        const count = counts[status] ?? 0
        const pct = total > 0 ? (count / total) * 100 : 0
        const barHeight = Math.max(pct * 0.8, count > 0 ? 8 : 0)

        return (
          <div key={status} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs font-semibold tabular-nums" style={{ color: cfg.color }}>
              {count}
            </span>
            <div className="relative w-full flex items-end" style={{ height: '64px' }}>
              <motion.div
                className="w-full rounded-t-md"
                style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`, borderBottom: 'none' }}
                initial={{ height: 0 }}
                animate={{ height: `${barHeight}%` }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
              />
            </div>
            <span className="text-[9px] text-stone-400 text-center leading-tight">{cfg.label}</span>
          </div>
        )
      })}
    </div>
  )
}
