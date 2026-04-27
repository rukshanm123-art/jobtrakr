'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ListChecks,
  BarChart3,
  LogOut,
  Briefcase,
  Plus,
} from 'lucide-react'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/applications', label: 'Applications', icon: ListChecks },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="fixed left-0 top-0 h-full w-56 border-r border-stone-200 bg-white flex flex-col z-20">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-stone-200">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-900">
          <Briefcase className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-stone-900">JobTrakr</span>
      </div>

      {/* New application button */}
      <div className="px-3 py-3 border-b border-stone-200">
        <Link
          href="/applications/new"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-stone-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Application
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors"
              style={{ color: active ? '#111110' : '#6B7280' }}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-pill"
                  className="absolute inset-0 rounded-lg bg-stone-100"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className="relative h-3.5 w-3.5" />
              <span className="relative">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User / sign out */}
      <div className="border-t border-stone-200 px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-white text-xs font-semibold flex-shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-stone-900">{session?.user?.name}</p>
            <p className="truncate text-[10px] text-stone-500">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-900"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
