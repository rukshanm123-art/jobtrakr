'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ApplicationCard } from '@/components/ApplicationCard'
import { StatusBadge } from '@/components/StatusBadge'
import { ALL_STATUSES, STATUS_CONFIG, type Application, type Status } from '@/lib/types'

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status | 'ALL'>('ALL')
  const [sort, setSort] = useState<'appliedAt' | 'company' | 'updatedAt'>('appliedAt')
  const [showFilters, setShowFilters] = useState(false)

  const fetchApps = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter !== 'ALL') params.set('status', statusFilter)
    params.set('sort', sort)
    params.set('order', 'desc')
    const res = await fetch(`/api/applications?${params}`)
    const data = await res.json()
    setApps(data)
    setLoading(false)
  }, [search, statusFilter, sort])

  useEffect(() => {
    const t = setTimeout(fetchApps, 300)
    return () => clearTimeout(t)
  }, [fetchApps])

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Applications</h1>
          <p className="mt-0.5 text-sm text-stone-500">
            {loading ? '...' : `${apps.length} application${apps.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Search + filters bar */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role..."
            className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-10 pr-4 text-sm text-stone-900 placeholder-stone-400 outline-none focus:border-stone-400 transition"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${showFilters ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-4 rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="mb-2 text-xs font-medium text-stone-700">Status</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setStatusFilter('ALL')}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors ${statusFilter === 'ALL' ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'}`}
                    >
                      All
                    </button>
                    {ALL_STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className="transition-opacity hover:opacity-80"
                        style={{ opacity: statusFilter === s ? 1 : 0.6 }}
                      >
                        <StatusBadge status={s} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-stone-700">Sort by</p>
                  <div className="flex gap-1.5">
                    {(['appliedAt', 'updatedAt', 'company'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSort(s)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors ${sort === s ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 text-stone-600 border-stone-200'}`}
                      >
                        {s === 'appliedAt' ? 'Date Applied' : s === 'updatedAt' ? 'Last Updated' : 'Company'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {statusFilter !== 'ALL' && (
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className="mt-3 flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X className="h-3 w-3" /> Clear filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="space-y-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl border border-stone-200 bg-white animate-pulse" />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-dashed border-stone-200 p-12 text-center"
        >
          <p className="text-sm text-stone-400">No applications found.</p>
        </motion.div>
      ) : (
        <div className="space-y-2.5">
          {apps.map((app, i) => (
            <ApplicationCard key={app.id} app={app} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
