import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { subWeeks, startOfWeek, format } from 'date-fns'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id
  const apps = await prisma.application.findMany({
    where: { userId },
    include: { events: { orderBy: { createdAt: 'asc' } } },
    orderBy: { appliedAt: 'asc' },
  })

  const total = apps.length
  const byStatus = apps.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Weekly applications for the last 12 weeks
  const weeklyApplications = []
  for (let i = 11; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(new Date(), i))
    const weekEnd = startOfWeek(subWeeks(new Date(), i - 1))
    const count = apps.filter(
      (a) => new Date(a.appliedAt) >= weekStart && new Date(a.appliedAt) < weekEnd
    ).length
    weeklyApplications.push({ week: format(weekStart, 'MMM d'), count })
  }

  const responded = apps.filter(
    (a) => !['APPLIED', 'WITHDRAWN'].includes(a.status)
  ).length

  const interviewed = apps.filter((a) =>
    ['INTERVIEW', 'TECHNICAL', 'FINAL_INTERVIEW', 'OFFER'].includes(a.status)
  ).length

  const offered = apps.filter((a) => a.status === 'OFFER').length

  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0
  const interviewRate = total > 0 ? Math.round((interviewed / total) * 100) : 0
  const offerRate = total > 0 ? Math.round((offered / total) * 100) : 0

  // Average days to first response
  const responseTimes = apps
    .filter((a) => a.events.length > 1)
    .map((a) => {
      const created = new Date(a.events[0].createdAt)
      const responded = new Date(a.events[1].createdAt)
      return (responded.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    })
  const avgDaysToResponse =
    responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0

  return NextResponse.json({
    total,
    byStatus,
    weeklyApplications,
    responseRate,
    interviewRate,
    offerRate,
    avgDaysToResponse,
  })
}
