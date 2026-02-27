import { NextRequest, NextResponse } from 'next/server';
import { fetchListings } from '@/lib/airtable';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') || undefined;
  const date = (searchParams.get('date') as 'today' | '7d' | 'all') || undefined;

  try {
    const data = await fetchListings({ status, date });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
