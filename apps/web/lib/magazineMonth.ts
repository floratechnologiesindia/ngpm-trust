/** Display label for `YYYY-MM` (from input type="month") or passthrough text. */
export function formatMagazineMonth(value: string) {
  if (/^\d{4}-\d{2}$/.test(value)) {
    return new Date(`${value}-01T12:00:00`).toLocaleDateString(undefined, {
      month: "long",
      year: "numeric"
    });
  }
  return value;
}
