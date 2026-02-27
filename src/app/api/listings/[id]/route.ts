import { NextRequest, NextResponse } from 'next/server';
import { fetchListingById } from '@/lib/airtable';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
const BASE_ID = process.env.AIRTABLE_BASE_ID || '';
const TABLE_ID = process.env.AIRTABLE_TABLE_ID || '';
const USE_MOCK = process.env.USE_MOCK_DATA === 'true';
const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

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

const ALLOWED_FIELDS = ['Pipeline Stage', 'Notes', 'next_action_date'];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const fields: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in body) fields[key] = body[key];
    }

    if (Object.keys(fields).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    if (USE_MOCK) {
      return NextResponse.json({ success: true, id, fields });
    }

    const res = await fetch(`${AIRTABLE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Airtable update failed:', errorText);
      return NextResponse.json({ error: 'Airtable update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}
