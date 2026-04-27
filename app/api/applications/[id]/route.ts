import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { STATUS_CONFIG } from '@/lib/types'
import type { Status } from '@/lib/types'

const ALLOWED_STATUSES: Status[] = [
  'APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'TECHNICAL',
  'FINAL_INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN',
]

async function getApp(id: string, userId: string) {
  return prisma.application.findFirst({
    where: { id, userId },
    include: { events: { orderBy: { createdAt: 'asc' } } },
  })
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

  // Validate status if provided
  const validStatus =
    status && ALLOWED_STATUSES.includes(status as Status) ? (status as Status) : null

  const statusChanged = validStatus && validStatus !== app.status

  // Use human-readable label in auto-note instead of raw enum value
  const autoNote = validStatus
    ? `Status updated to ${STATUS_CONFIG[validStatus].label}`
    : undefined

  const updated = await prisma.application.update({
    where: { id },
    data: {
      ...(company?.trim() && { company: company.trim() }),
      ...(role?.trim() && { role: role.trim() }),
      location: location !== undefined ? location?.trim() || null : undefined,
      salary: salary !== undefined ? salary?.trim() || null : undefined,
      jobUrl: jobUrl !== undefined ? jobUrl?.trim() || null : undefined,
      ...(validStatus && { status: validStatus }),
      notes: notes !== undefined ? notes?.trim() || null : undefined,
      ...(appliedAt && { appliedAt: new Date(appliedAt) }),
      ...(statusChanged && {
        events: {
          create: { status: validStatus!, note: eventNote?.trim() || autoNote },
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
