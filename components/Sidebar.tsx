'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ListChecks,
  BarChart3,
  LogOut,
  Briefcase,
  Plus,
  Moon,
  Sun,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/applications', label: 'Applications', icon: ListChecks },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <aside className="fixed left-0 top-0 h-full w-56 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 flex flex-col z-20">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-stone-200 dark:border-stone-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-900 dark:bg-stone-100">
          <Briefcase className="h-3.5 w-3.5 text-white dark:text-stone-900" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">JobTrakr</span>
      </div>

      {/* New application button */}
      <div className="px-3 py-3 border-b border-stone-200 dark:border-stone-800">
        <Link
          href="/applications/new"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 dark:bg-stone-100 px-3 py-2 text-xs font-medium text-white dark:text-stone-900 transition-colors hover:bg-stone-700 dark:hover:bg-stone-300"
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
              style={{ color: active ? (isDark ? '#f5f5f4' : '#111110') : '#6B7280' }}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-pill"
                  className="absolute inset-0 rounded-lg bg-stone-100 dark:bg-stone-800"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className="relative h-3.5 w-3.5" />
              <span className="relative">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Dark mode toggle */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-stone-500 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100"
          aria-label="Toggle dark mode"
        >
          {mounted ? (
            isDark ? (
              <>
                <Sun className="h-3.5 w-3.5" />
                Light mode
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5" />
                Dark mode
              </>
            )
          ) : (
            <>
              <Moon className="h-3.5 w-3.5" />
              Dark mode
            </>
          )}
        </button>
      </div>

      {/* User / sign out */}
      <div className="border-t border-stone-200 dark:border-stone-800 px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold flex-shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-stone-900 dark:text-stone-100">{session?.user?.name}</p>
            <p className="truncate text-[10px] text-stone-500 dark:text-stone-500">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-stone-500 dark:text-stone-400 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
