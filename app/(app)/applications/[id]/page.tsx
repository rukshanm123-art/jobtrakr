import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ApplicationDetail } from './ApplicationDetail'

export const dynamic = 'force-dynamic'

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  const { id } = await params
  const app = await prisma.application.findFirst({
    where: { id, userId: session.user.id },
    include: { events: { orderBy: { createdAt: 'asc' } } },
  })
  if (!app) notFound()
  return <ApplicationDetail application={JSON.parse(JSON.stringify(app))} />
}
