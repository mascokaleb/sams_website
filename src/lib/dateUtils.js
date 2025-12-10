const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Parse Sanity date fields without shifting a day for local timezones.
export function parseDate(value) {
  if (!value) {
    return null;
  }

  const input = typeof value === "string" ? value.trim() : value;
  if (!input) {
    return null;
  }

  const normalized =
    typeof input === "string" && DATE_ONLY_PATTERN.test(input) ? `${input}T00:00:00` : input;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}
