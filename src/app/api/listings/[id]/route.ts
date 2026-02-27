import { NextRequest, NextResponse } from 'next/server';
import { fetchListingById } from '@/lib/airtable';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const listing = await fetchListingById(id);
    if (!listing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(listing);
  } catch (error) {
    console.error('Failed to fetch listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}
