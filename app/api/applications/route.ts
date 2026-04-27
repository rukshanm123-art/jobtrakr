import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') ?? 'appliedAt'
  const order = (searchParams.get('order') ?? 'desc') as 'asc' | 'desc'

  const applications = await prisma.application.findMany({
    where: {
      userId: session.user.id,
      ...(status && status !== 'ALL' ? { status: status as never } : {}),
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

  const application = await prisma.application.create({
    data: {
      userId: session.user.id,
      company,
      role,
      location: location || null,
      salary: salary || null,
      jobUrl: jobUrl || null,
      status: status ?? 'APPLIED',
      notes: notes || null,
      appliedAt: appliedAt ? new Date(appliedAt) : new Date(),
      events: {
        create: {
          status: status ?? 'APPLIED',
          note: 'Application created',
        },
      },
    },
    include: { events: true },
  })

  return NextResponse.json(application, { status: 201 })
}
