export function formatPrice(value: number | null | undefined): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatYield(value: number | null | undefined): string {
  if (value == null) return '—';
  return `${value.toFixed(2)} %`;
}

export function formatArea(value: number | null | undefined): string {
  if (value == null) return '—';
  return `${new Intl.NumberFormat('de-DE').format(value)} m²`;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function parseRisks(risksField: string | null | undefined): string[] {
  if (!risksField) return [];
  try {
    const parsed = JSON.parse(risksField);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isToday(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}
