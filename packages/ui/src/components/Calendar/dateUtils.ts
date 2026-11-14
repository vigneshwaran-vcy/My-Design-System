/**
 * Small date helpers shared by Calendar, Datepicker, Timepicker and DatetimePicker.
 * Built on the native Date and Intl APIs only; every date is treated as a local calendar day.
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const isSameMonth = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** Negative when `a` is an earlier day than `b`, 0 on the same day, positive when later. */
export const compareDays = (a: Date, b: Date) => startOfDay(a).getTime() - startOfDay(b).getTime();

export const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

/** Adds months, clamping the day so 31 Jan + 1 month is 28/29 Feb rather than early March. */
export const addMonths = (date: Date, months: number) => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
};

export const addYears = (date: Date, years: number) => addMonths(date, years * 12);

/** Keeps `date` inside [min, max] (day precision). */
export const clampDay = (date: Date, min?: Date | null, max?: Date | null) => {
  if (min && compareDays(date, min) < 0) return startOfDay(min);
  if (max && compareDays(date, max) > 0) return startOfDay(max);
  return date;
};

export const isOutOfRange = (date: Date, min?: Date | null, max?: Date | null) =>
  (!!min && compareDays(date, min) < 0) || (!!max && compareDays(date, max) > 0);

/** First day of the week for a locale (0 = Sunday), from Intl.Locale week info when the runtime has it. */
export function getFirstDayOfWeek(locale?: string): Weekday {
  try {
    const loc = new Intl.Locale(locale ?? new Intl.DateTimeFormat().resolvedOptions().locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const info = loc.getWeekInfo?.() ?? loc.weekInfo;
    if (info) return (info.firstDay % 7) as Weekday;
  } catch {
    // Unknown locale or no week info: fall through.
  }
  return 0;
}

/** Seven weekday names starting at `firstDayOfWeek`, in the requested Intl style. */
export function getWeekdays(locale: string | undefined, firstDayOfWeek: Weekday) {
  const long = new Intl.DateTimeFormat(locale, { weekday: 'long' });
  const short = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const narrow = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
  // 4 Jan 2026 is a Sunday.
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(2026, 0, 4 + ((firstDayOfWeek + i) % 7));
    return { long: long.format(day), short: short.format(day), narrow: narrow.format(day) };
  });
}

/** Six full weeks covering the month of `month`, starting on `firstDayOfWeek`. */
export function getMonthWeeks(month: Date, firstDayOfWeek: Weekday): Date[][] {
  const first = startOfMonth(month);
  const offset = (first.getDay() - firstDayOfWeek + 7) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));
}

/* ------------------------------------------------------------------ */
/* Date text formats: patterns made of YYYY, MM, M, DD, D + separators */
/* ------------------------------------------------------------------ */

const TOKEN_RE = /YYYY|MM|DD|M|D/g;

/** Numeric date pattern for a locale, e.g. en-US → "MM/DD/YYYY", en-GB → "DD/MM/YYYY", de → "DD.MM.YYYY". */
export function getDatePattern(locale?: string): string {
  const parts = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(
    new Date(2026, 10, 23),
  );
  const pattern = parts
    .map((part) => {
      if (part.type === 'year') return 'YYYY';
      if (part.type === 'month') return 'MM';
      if (part.type === 'day') return 'DD';
      if (part.type === 'literal') return part.value.replace(/[‎‏]/g, '');
      return '';
    })
    .join('');
  return /YYYY/.test(pattern) && /MM/.test(pattern) && /DD/.test(pattern) ? pattern.trim() : 'YYYY-MM-DD';
}

const pad = (n: number, width = 2) => String(n).padStart(width, '0');

export function formatDate(date: Date, pattern: string): string {
  return pattern.replace(TOKEN_RE, (token) => {
    switch (token) {
      case 'YYYY':
        return pad(date.getFullYear(), 4);
      case 'MM':
        return pad(date.getMonth() + 1);
      case 'M':
        return String(date.getMonth() + 1);
      case 'DD':
        return pad(date.getDate());
      default:
        return String(date.getDate());
    }
  });
}

/** ISO calendar date (YYYY-MM-DD) in local time, for form submission. */
export const toISODate = (date: Date) => formatDate(date, 'YYYY-MM-DD');

const buildDate = (year: number, month: number, day: number) => {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  date.setFullYear(year); // keep years below 100 literal
  return date.getMonth() === month - 1 && date.getDate() === day ? date : null;
};

/**
 * Parses typed text in `pattern` order. Accepts any non-digit separators, 1–2 digit day/month,
 * 2-digit years (→ 20xx), unseparated digits in the pattern's widths, and ISO `YYYY-MM-DD`.
 */
export function parseDate(text: string, pattern: string): Date | null {
  const value = text.trim();
  if (!value) return null;
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
  if (iso) return buildDate(+iso[1], +iso[2], +iso[3]);

  const order = pattern.match(TOKEN_RE) ?? ['YYYY', 'MM', 'DD'];
  let groups: string[] = value.match(/\d+/g) ?? [];
  if (groups.length === 1 && groups[0].length === order.reduce((n, t) => n + (t === 'YYYY' ? 4 : 2), 0)) {
    const digits = groups[0];
    let index = 0;
    groups = order.map((t) => {
      const width = t === 'YYYY' ? 4 : 2;
      const group = digits.slice(index, index + width);
      index += width;
      return group;
    });
  }
  if (groups.length !== 3 || order.length !== 3) return null;

  let year = NaN;
  let month = NaN;
  let day = NaN;
  order.forEach((token, i) => {
    const n = Number(groups[i]);
    if (token === 'YYYY') year = groups[i].length <= 2 ? 2000 + n : n;
    else if (token.startsWith('M')) month = n;
    else day = n;
  });
  if (groups[order.indexOf('YYYY')]?.length === 3) return null;
  return buildDate(year, month, day);
}

/* ------------------------------------------------------------------ */
/* Times: minutes since midnight, exchanged as "HH:mm" strings         */
/* ------------------------------------------------------------------ */

/** Whether a locale writes times on a 12-hour clock. */
export function usesHour12(locale?: string): boolean {
  const options = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions() as Intl.ResolvedDateTimeFormatOptions & {
    hourCycle?: string;
  };
  if (options.hourCycle) return options.hourCycle === 'h11' || options.hourCycle === 'h12';
  return options.hour12 ?? false;
}

export const toTimeString = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

/** "HH:mm" (or "H:mm") → minutes since midnight, or null. */
export function timeToMinutes(value: string | null | undefined): number | null {
  const match = value ? /^(\d{1,2}):(\d{2})$/.exec(value) : null;
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  return h < 24 && m < 60 ? h * 60 + m : null;
}

export const minutesOfDate = (date: Date) => date.getHours() * 60 + date.getMinutes();

/** Locale time label, e.g. "9:30 AM" or "09:30". Narrow no-break spaces become plain spaces so typed text matches. */
export function formatTime(minutes: number, locale: string | undefined, hour12: boolean): string {
  const date = new Date(2026, 0, 1, Math.floor(minutes / 60), minutes % 60);
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', hour12 })
    .format(date)
    .replace(/[  ]/g, ' ');
}

/** Parses typed times such as "9", "930", "9:30", "9.30 pm", "9p", "21:30". Returns minutes since midnight. */
export function parseTime(text: string): number | null {
  const value = text.toLowerCase().replace(/[\s.  ]/g, '').replace(/^(\d{1,2})h/, '$1:');
  const match = /^(\d{1,2})(?::?(\d{2}))?(a|am|p|pm)?$/.exec(value);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3]?.[0];
  if (minutes > 59) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    hours = (hours % 12) + (meridiem === 'p' ? 12 : 0);
  } else if (hours > 23) return null;
  return hours * 60 + minutes;
}
