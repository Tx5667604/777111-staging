import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, phoneModel, issue, imageUrl } = body

    if (!name || !phone || !phoneModel || !issue) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    const order = await db.order.create({
      data: {
        name,
        phone,
        phoneModel,
        issue,
        imageUrl: imageUrl || null,
        status: 'new',
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
