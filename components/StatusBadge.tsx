'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Status, STATUS_CONFIG } from '@/lib/types'

export function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status]
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const dark = mounted && resolvedTheme === 'dark'
  const bg = dark ? cfg.darkBg : cfg.bg
  const border = dark ? cfg.darkBorder : cfg.border

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: bg, color: cfg.color, border: `1px solid ${border}` }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: cfg.color }}
      />
      {cfg.label}
    </span>
  )
}
