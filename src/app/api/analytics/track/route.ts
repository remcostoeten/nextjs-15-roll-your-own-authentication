import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/modules/rollyourownanalytics/server/mutations/track-event'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const result = await trackEvent(body)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in track API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
