import { Listing } from './types';
import { MOCK_LISTINGS } from './mock-data';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
const BASE_ID = process.env.AIRTABLE_BASE_ID || '';
const TABLE_ID = process.env.AIRTABLE_TABLE_ID || '';
const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

const AIRTABLE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

function mapRecord(record: Record<string, unknown>): Listing {
  const f = record.fields as Record<string, unknown>;
  return {
    id: record.id as string,
    listing_id: (f.listing_id as string) ?? '',
    url: (f.url as string) ?? '',
    title: (f.title as string) ?? '',
    address: (f.address as string) ?? '',
    postcode: (f.postcode as string) ?? '',
    purchase_price: Number(f.purchase_price) || 0,
    living_area: Number(f.living_area) || 0,
    rooms: f.rooms != null ? Number(f.rooms) : null,
    building_type: (f.building_type as string) ?? '',
    year_built: f.year_built != null ? Number(f.year_built) : null,
    last_refurbish: (f.last_refurbish as string) ?? null,
    energy_class: (f.energy_class as string) ?? 'not stated',
    heating_type: (f.heating_type as string) ?? 'not stated',
    firing_type: (f.firing_type as string) ?? 'not stated',
    is_rented: (f.is_rented as string) ?? 'not stated',
    days_since_listed: f.days_since_listed != null ? Number(f.days_since_listed) : null,
    price_per_sqm: f.price_per_sqm != null ? Number(f.price_per_sqm) : null,
    yield_pct: f.yield_pct != null ? Number(f.yield_pct) : null,
    yield_rating: (f.yield_rating as string) ?? '⚪ Unknown',
    status: (f.status as Listing['status']) ?? '',
    summary: (f.summary as string) ?? '',
    risks: (f.risks as string) ?? '[]',
    reason: (f.reason as string) ?? '',
    analyzed_at: (f.analyzed_at as string) ?? '',
    description: (f.description as string) ?? '',
    'Agent Email': (f['Agent Email'] as string) ?? '',
    'Agent Name': (f['Agent Name'] as string) ?? '',
    'Agent Phone': (f['Agent Phone'] as string) ?? '',
    'Pipeline Stage': (f['Pipeline Stage'] as Listing['Pipeline Stage']) ?? '',
    Notes: (f.Notes as string) ?? '',
    next_action_date: (f.next_action_date as string) ?? '',
    pre_filter_reason: (f.pre_filter_reason as string) ?? '',
    flagged_potential_duplicate: (f.flagged_potential_duplicate as boolean) || false,
  };
}

export interface FetchListingsOptions {
  status?: string;
  date?: 'today' | '7d' | 'all';
  sortField?: string;
  sortDir?: 'asc' | 'desc';
}

export async function fetchListings(options?: FetchListingsOptions): Promise<{ records: Listing[]; total: number }> {
  if (USE_MOCK) {
    let listings = [...MOCK_LISTINGS];

    if (options?.status) {
      listings = listings.filter((l) => l.status === options.status);
    }

    if (options?.date === 'today') {
      const today = new Date();
      listings = listings.filter((l) => {
        if (!l.analyzed_at) return false;
        const d = new Date(l.analyzed_at);
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      });
    } else if (options?.date === '7d') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
      listings = listings.filter((l) => {
        if (!l.analyzed_at) return false;
        return new Date(l.analyzed_at) >= sevenDaysAgo;
      });
    }

    return { records: listings, total: listings.length };
  }

  // Build Airtable API params
  const params = new URLSearchParams();

  const filters: string[] = [];
  if (options?.status) {
    filters.push(`{status} = '${options.status}'`);
  }
  if (options?.date === 'today') {
    filters.push(`IS_SAME({analyzed_at}, TODAY(), 'day')`);
  } else if (options?.date === '7d') {
    filters.push(`DATETIME_DIFF(TODAY(), {analyzed_at}, 'days') <= 7`);
  }

  if (filters.length > 1) {
    params.set('filterByFormula', `AND(${filters.join(', ')})`);
  } else if (filters.length === 1) {
    params.set('filterByFormula', filters[0]);
  }

  if (options?.sortField) {
    params.set('sort[0][field]', options.sortField);
    params.set('sort[0][direction]', options?.sortDir || 'desc');
  } else {
    params.set('sort[0][field]', 'analyzed_at');
    params.set('sort[0][direction]', 'desc');
  }

  const allRecords: Listing[] = [];
  let offset: string | undefined;

  do {
    if (offset) params.set('offset', offset);
    const res = await fetch(`${AIRTABLE_URL}?${params}`, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Airtable error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    allRecords.push(...data.records.map(mapRecord));
    offset = data.offset;
  } while (offset);

  return { records: allRecords, total: allRecords.length };
}

export async function fetchListingById(id: string): Promise<Listing | null> {
  if (USE_MOCK) {
    return MOCK_LISTINGS.find((l) => l.id === id) ?? null;
  }

  const res = await fetch(`${AIRTABLE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  const record = await res.json();
  return mapRecord(record);
}
