import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Status } from '@/lib/types'

const ALLOWED_SORTS = ['appliedAt', 'company', 'updatedAt'] as const
type AllowedSort = typeof ALLOWED_SORTS[number]

const ALLOWED_STATUSES: Status[] = [
  'APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'TECHNICAL',
  'FINAL_INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN',
]

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const statusParam = searchParams.get('status')
  const search = searchParams.get('search')
  const sortParam = searchParams.get('sort') ?? 'appliedAt'
  const orderParam = searchParams.get('order') ?? 'desc'

  // Validate sort field to prevent Prisma runtime errors
  const sort: AllowedSort = ALLOWED_SORTS.includes(sortParam as AllowedSort)
    ? (sortParam as AllowedSort)
    : 'appliedAt'

  const order = orderParam === 'asc' ? 'asc' : 'desc'

  // Validate status value
  const status =
    statusParam && statusParam !== 'ALL' && ALLOWED_STATUSES.includes(statusParam as Status)
      ? (statusParam as Status)
      : null

  const applications = await prisma.application.findMany({
    where: {
      userId: session.user.id,
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { company: { contains: search, mode: 'insensitive' } },
              { role: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: { events: { orderBy: { createdAt: 'asc' } } },
    orderBy: { [sort]: order },
  })

  return NextResponse.json(applications)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { company, role, location, salary, jobUrl, status, notes, appliedAt } = body

  if (!company || !role)
    return NextResponse.json({ error: 'Company and role are required' }, { status: 400 })

  const resolvedStatus: Status =
    status && ALLOWED_STATUSES.includes(status as Status) ? (status as Status) : 'APPLIED'

  const application = await prisma.application.create({
    data: {
      userId: session.user.id,
      company: company.trim(),
      role: role.trim(),
      location: location?.trim() || null,
      salary: salary?.trim() || null,
      jobUrl: jobUrl?.trim() || null,
      status: resolvedStatus,
      notes: notes?.trim() || null,
      appliedAt: appliedAt ? new Date(appliedAt) : new Date(),
      events: {
        create: {
          status: resolvedStatus,
          note: 'Application created',
        },
      },
    },
    include: { events: true },
  })

  return NextResponse.json(application, { status: 201 })
}
