'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { AnimatedCounter } from '@/components/AnimatedCounter'
import { ALL_STATUSES, STATUS_CONFIG } from '@/lib/types'

interface StatsData {
  total: number
  byStatus: Record<string, number>
  weeklyApplications: { week: string; count: number }[]
  responseRate: number
  interviewRate: number
  offerRate: number
  avgDaysToResponse: number
}

export default function Analytics() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats').then((r) => r.json()).then((d) => { setStats(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="h-8 w-48 rounded-lg bg-stone-200 animate-pulse mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-stone-200 animate-pulse" />)}
      </div>
    </div>
  )

  if (!stats) return null

  const pieData = ALL_STATUSES
    .filter((s) => (stats.byStatus[s] ?? 0) > 0)
    .map((s) => ({ name: STATUS_CONFIG[s].label, value: stats.byStatus[s], color: STATUS_CONFIG[s].color }))

  const barData = ALL_STATUSES
    .filter((s) => !['REJECTED', 'WITHDRAWN'].includes(s))
    .map((s) => ({ name: STATUS_CONFIG[s].label, count: stats.byStatus[s] ?? 0, color: STATUS_CONFIG[s].color }))

  const kpis = [
    { label: 'Total Applied', value: stats.total, suffix: '' },
    { label: 'Response Rate', value: stats.responseRate, suffix: '%' },
    { label: 'Interview Rate', value: stats.interviewRate, suffix: '%' },
    { label: 'Avg Days to Response', value: stats.avgDaysToResponse, suffix: 'd' },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">Analytics</h1>
        <p className="mt-1 text-sm text-stone-500">Insights from your job search data.</p>
      </motion.div>

      {/* KPI row */}
      <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, suffix }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-xl border border-stone-200 bg-white p-4"
          >
            <p className="text-xs font-medium text-stone-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-stone-900 tabular-nums">
              <AnimatedCounter value={value} suffix={suffix} />
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Applications over time */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-stone-200 bg-white p-5 lg:col-span-2"
        >
          <h2 className="mb-4 text-sm font-semibold text-stone-900">Applications Per Week (Last 12 Weeks)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.weeklyApplications} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ec" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #e5e5e0', borderRadius: '8px', fontSize: '12px', backgroundColor: '#fff' }}
                cursor={{ stroke: '#e5e5e0' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#111110"
                strokeWidth={2}
                dot={{ r: 3, fill: '#111110', strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pipeline bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl border border-stone-200 bg-white p-5"
        >
          <h2 className="mb-4 text-sm font-semibold text-stone-900">Active Pipeline</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ec" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ border: '1px solid #e5e5e0', borderRadius: '8px', fontSize: '12px', backgroundColor: '#fff' }}
                cursor={{ fill: '#f9faf8' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status breakdown pie */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-stone-200 bg-white p-5"
        >
          <h2 className="mb-4 text-sm font-semibold text-stone-900">Status Breakdown</h2>
          {pieData.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-sm text-stone-400">No data yet</p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ border: '1px solid #e5e5e0', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-stone-600">{d.name}</span>
                    </div>
                    <span className="text-xs font-medium tabular-nums text-stone-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
