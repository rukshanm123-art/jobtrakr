'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, Send, Users, Trophy, ArrowRight } from 'lucide-react'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { ApplicationCard } from '@/components/ApplicationCard'
import { Pipeline } from '@/components/Pipeline'
import type { Application } from '@/lib/types'

interface Props {
  recent: Application[]
  total: number
  byStatus: Record<string, number>
  responseRate: number
  interviewRate: number
  userName: string
  greeting: string
}

const stat = (label: string, value: number, suffix: string, icon: React.ElementType, desc: string) => ({
  label, value, suffix, icon, desc,
})

export function DashboardClient({ recent, total, byStatus, responseRate, interviewRate, userName, greeting }: Props) {
  const stats = [
    stat('Total Applied', total, '', Send, 'All time'),
    stat('Response Rate', responseRate, '%', TrendingUp, 'Got a reply'),
    stat('Interview Rate', interviewRate, '%', Users, 'Reached interview'),
    stat('Active', Object.entries(byStatus).filter(([s]) => !['REJECTED', 'WITHDRAWN'].includes(s)).reduce((a, [, v]) => a + v, 0), '', Trophy, 'In progress'),
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
          {greeting}, {userName.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Here&apos;s your job search at a glance.</p>
      </motion.div>

      {/* Stats grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, suffix, icon: Icon, desc }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">{label}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800">
                <Icon className="h-3.5 w-3.5 text-stone-600 dark:text-stone-400" />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              <AnimatedCounter value={value} suffix={suffix} />
            </p>
            <p className="mt-1 text-[11px] text-stone-400 dark:text-stone-500">{desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5"
        >
          <h2 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">Pipeline</h2>
          <Pipeline counts={byStatus} total={total} />
        </motion.div>

        {/* Recent applications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Recent Applications</h2>
            <Link href="/applications" className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-200 dark:border-stone-700 p-8 text-center">
              <p className="text-sm text-stone-400 dark:text-stone-500">No applications yet.</p>
              <Link href="/applications/new" className="mt-3 inline-block text-xs font-medium text-stone-900 dark:text-stone-100 underline underline-offset-2">
                Add your first one
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recent.map((app, i) => (
                <ApplicationCard key={app.id} app={app} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
