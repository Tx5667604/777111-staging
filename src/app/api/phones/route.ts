import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const brand = searchParams.get('brand')

    const where: Record<string, unknown> = { available: true }
    if (brand) where.brand = brand

    const phones = await db.phone.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(phones)
  } catch (error) {
    console.error('Error fetching phones:', error)
    return NextResponse.json({ error: 'Failed to fetch phones' }, { status: 500 })
  }
}
