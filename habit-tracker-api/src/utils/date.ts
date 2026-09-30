export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // Midday to prevent DST edge shifts
}

export function getTodayDateString(): string {
  return formatDate(new Date());
}

export function getYesterdayDateString(): string {
  return addDays(getTodayDateString(), -1);
}

export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export function daysBetween(dateStr1: string, dateStr2: string): number {
  const d1 = parseDate(dateStr1);
  const d2 = parseDate(dateStr2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getDayOfWeek(dateStr: string): number {
  return parseDate(dateStr).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
}

export function getStartOfWeek(dateStr: string): string {
  const d = parseDate(dateStr);
  const day = d.getDay();
  // We'll treat Monday (1) as start of week, Sunday (0) as 7th day
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return formatDate(d);
}

export function getDatesInRange(startDateStr: string, endDateStr: string): string[] {
  const dates: string[] = [];
  let current = startDateStr;
  while (current <= endDateStr) {
    dates.push(current);
    current = addDays(current, 1);
  }
  return dates;
}

export function isHabitScheduledForDate(
  frequency_type: 'daily' | 'weekly' | 'custom_days',
  target_days: number[],
  dateStr: string
): boolean {
  if (frequency_type === 'daily') {
    return true;
  }
  if (frequency_type === 'custom_days') {
    const dayOfWeek = getDayOfWeek(dateStr);
    return target_days.includes(dayOfWeek);
  }
  if (frequency_type === 'weekly') {
    return true;
  }
  return true;
}
