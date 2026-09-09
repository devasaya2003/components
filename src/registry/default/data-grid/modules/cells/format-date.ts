export function formatDataGridDate(value: string, locale?: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "—") {
    return "—";
  }

  const timestamp = Date.parse(
    trimmed.length === 10 ? `${trimmed}T00:00:00` : trimmed,
  );

  if (Number.isNaN(timestamp)) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}
