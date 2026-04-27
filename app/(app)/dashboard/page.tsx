import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardClient } from './DashboardClient'

export const dynamic = 'force-dynamic'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  return 'Evening'
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const [apps, stats] = await Promise.all([
    prisma.application.findMany({
      where: { userId: session.user.id },
      include: { events: { orderBy: { createdAt: 'asc' } } },
      orderBy: { appliedAt: 'desc' },
      take: 5,
    }),
    prisma.application.groupBy({
      by: ['status'],
      where: { userId: session.user.id },
      _count: true,
    }),
  ])

  const total = await prisma.application.count({ where: { userId: session.user.id } })
  const byStatus = Object.fromEntries(stats.map((s) => [s.status, s._count]))

  const responded = stats
    .filter((s) => !['APPLIED', 'WITHDRAWN'].includes(s.status))
    .reduce((a, s) => a + s._count, 0)

  const interviewed = stats
    .filter((s) => ['INTERVIEW', 'TECHNICAL', 'FINAL_INTERVIEW', 'OFFER'].includes(s.status))
    .reduce((a, s) => a + s._count, 0)

  return (
    <DashboardClient
      recent={JSON.parse(JSON.stringify(apps))}
      total={total}
      byStatus={byStatus}
      responseRate={total > 0 ? Math.round((responded / total) * 100) : 0}
      interviewRate={total > 0 ? Math.round((interviewed / total) * 100) : 0}
      userName={session.user.name ?? ''}
      greeting={getGreeting()}
    />
  )
}
