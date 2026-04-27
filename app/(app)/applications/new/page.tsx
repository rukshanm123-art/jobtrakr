import { ApplicationForm } from '@/components/ApplicationForm'

export default function NewApplication() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">Add Application</h1>
        <p className="mt-1 text-sm text-stone-500">Log a new job application.</p>
      </div>
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <ApplicationForm />
      </div>
    </div>
  )
}
