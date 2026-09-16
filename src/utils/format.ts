import dayjs from 'dayjs';

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return `$${amount}`;
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatDate(date: string, format: string = 'MMM D, YYYY'): string {
  if (!date) return 'TBA';
  const d = dayjs(date);
  if (!d.isValid()) return 'TBA';
  return d.format(format);
}

export function formatYear(date: string): string {
  if (!date) return '';
  const year = dayjs(date).year();
  return year > 0 ? String(year) : '';
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

export function getRatingColor(rating: number): string {
  if (rating >= 7.5) return 'text-accent-emerald';
  if (rating >= 5) return 'text-accent-gold';
  return 'text-accent-rose';
}

export function getRatingBgColor(rating: number): string {
  if (rating >= 7.5) return 'bg-accent-emerald/20';
  if (rating >= 5) return 'bg-accent-gold/20';
  return 'bg-accent-rose/20';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '...';
}

export function getGenreNameById(id: number, genres: { id: number; name: string }[]): string {
  return genres.find(g => g.id === id)?.name || '';
}

export function timeAgo(date: string): string {
  const now = dayjs();
  const d = dayjs(date);
  const diffMinutes = now.diff(d, 'minute');
  const diffHours = now.diff(d, 'hour');
  const diffDays = now.diff(d, 'day');
  const diffWeeks = now.diff(d, 'week');
  const diffMonths = now.diff(d, 'month');
  const diffYears = now.diff(d, 'year');

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
}
