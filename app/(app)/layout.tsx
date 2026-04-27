import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF8] dark:bg-[#0c0c0b]">
      <Sidebar />
      <main className="ml-56 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
