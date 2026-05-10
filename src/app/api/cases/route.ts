import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cases = await db.repairCase.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(cases)
  } catch (error) {
    console.error('Error fetching repair cases:', error)
    return NextResponse.json({ error: 'Failed to fetch repair cases' }, { status: 500 })
  }
}
