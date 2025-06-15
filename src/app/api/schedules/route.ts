import { getSchedulesForWeek } from '@/actions/schedule-actions'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const orgId = searchParams.get('orgId')

  if (!start || !end || !orgId) {
    return new Response('Missing parameters', { status: 400 })
  }

  try {
    const data = await getSchedulesForWeek(
      new Date(start),
      new Date(end),
      orgId
    )
    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
