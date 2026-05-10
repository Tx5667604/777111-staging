import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')

    const where: Record<string, string> = {}
    if (brand) where.brand = brand
    if (model) where.model = model

    const repairs = await db.repairService.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { brand: 'asc' },
    })

    return NextResponse.json(repairs)
  } catch (error) {
    console.error('Error fetching repair services:', error)
    return NextResponse.json({ error: 'Failed to fetch repair services' }, { status: 500 })
  }
}
