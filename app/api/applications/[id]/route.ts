import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getApp(id: string, userId: string) {
  return prisma.application.findFirst({ where: { id, userId }, include: { events: { orderBy: { createdAt: 'asc' } } } })
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const app = await getApp(id, session.user.id)
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(app)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const app = await getApp(id, session.user.id)
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const { company, role, location, salary, jobUrl, status, notes, appliedAt, eventNote } = body

  const statusChanged = status && status !== app.status

  const updated = await prisma.application.update({
    where: { id },
    data: {
      ...(company && { company }),
      ...(role && { role }),
      location: location !== undefined ? location || null : undefined,
      salary: salary !== undefined ? salary || null : undefined,
      jobUrl: jobUrl !== undefined ? jobUrl || null : undefined,
      ...(status && { status }),
      notes: notes !== undefined ? notes || null : undefined,
      ...(appliedAt && { appliedAt: new Date(appliedAt) }),
      ...(statusChanged && {
        events: {
          create: { status, note: eventNote || `Status updated to ${status}` },
        },
      }),
    },
    include: { events: { orderBy: { createdAt: 'asc' } } },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const app = await getApp(id, session.user.id)
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.application.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
