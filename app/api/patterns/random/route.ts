import { getRandomPatternServer } from '@/app/_actions/patterns'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 172800 // Cache for 48 hours

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const locale = searchParams.get('locale') || 'en'

  const pattern = await getRandomPatternServer(locale)
  return NextResponse.json(pattern, {
    headers: {
      'Cache-Control': 'public, s-maxage=172800, stale-while-revalidate=172800',
    },
  })
}
