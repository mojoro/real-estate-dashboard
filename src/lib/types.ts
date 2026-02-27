export type ListingStatus = 'GO' | 'PRÜFEN' | 'NO-GO' | '';

export type EnergyClass =
  | 'A_PLUS' | 'A' | 'B' | 'C' | 'D'
  | 'E' | 'F' | 'G' | 'H' | 'not stated';

export type PipelineStage =
  | 'NEW' | 'CONTACTED' | 'VIEWING'
  | 'OFFER' | 'PASSED' | 'CLOSED' | '';

export interface Listing {
  id: string;
  listing_id: string;
  url: string;
  title: string;
  address: string;
  postcode: string;
  purchase_price: number;
  living_area: number;
  rooms: number | null;
  building_type: string;
  year_built: number | null;
  last_refurbish: string | null;
  energy_class: string;
  heating_type: string;
  firing_type: string;
  is_rented: string;
  days_since_listed: number | null;
  price_per_sqm: number | null;
  yield_pct: number | null;
  yield_rating: string;
  status: ListingStatus;
  summary: string;
  risks: string;
  reason: string;
  analyzed_at: string;
  description: string;
  'Agent Email': string;
  'Agent Name': string;
  'Agent Phone': string;
  'Pipeline Stage': PipelineStage;
  Notes: string;
  next_action_date: string;
  pre_filter_reason: string;
  flagged_potential_duplicate: boolean | '';
}

export interface DashboardStats {
  totalToday: number;
  goCount: number;
  pruefenCount: number;
  bestYield: number | null;
}

export type SortField = 'purchase_price' | 'yield_pct' | 'living_area';
export type SortDirection = 'asc' | 'desc';
