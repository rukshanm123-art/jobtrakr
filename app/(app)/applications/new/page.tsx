import { ApplicationForm } from '@/components/ApplicationForm'

export default function NewApplication() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Add Application</h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">Log a new job application.</p>
      </div>
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6">
        <ApplicationForm />
      </div>
    </div>
  )
}
