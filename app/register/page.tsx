'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Briefcase, User, Mail, Lock, ArrowRight } from 'lucide-react'

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Something went wrong')
      setLoading(false)
    } else {
      router.push('/login?registered=1')
    }
  }

  const inputCls = 'w-full rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 py-2.5 pr-4 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 outline-none focus:border-stone-400 dark:focus:border-stone-500 transition'

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#FAFAF8] dark:bg-[#0c0c0b]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 dark:bg-stone-100">
            <Briefcase className="h-5 w-5 text-white dark:text-stone-900" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Create account</h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Start tracking your job search</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
            <input required placeholder="Full name" value={form.name} onChange={set('name')} className={`${inputCls} pl-10`} />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
            <input type="email" required placeholder="Email address" value={form.email} onChange={set('email')} className={`${inputCls} pl-10`} />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
            <input type="password" required minLength={8} placeholder="Password (min 8 chars)" value={form.password} onChange={set('password')} className={`${inputCls} pl-10`} />
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 px-3 py-2 text-xs text-red-600 dark:text-red-400">
              {error}
            </motion.p>
          )}

          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 dark:bg-stone-100 py-2.5 text-sm font-medium text-white dark:text-stone-900 transition hover:bg-stone-700 dark:hover:bg-stone-300 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create account'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-stone-500 dark:text-stone-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-stone-900 dark:text-stone-100 underline underline-offset-2">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
