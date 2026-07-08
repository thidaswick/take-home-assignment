/** Formats a Date as local YYYY-MM-DD (for `<input type="date">`). */
export function toDateInputValue(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Adds days to a date using the local calendar (avoids UTC day-shift). */
export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  return next;
}

/** Sends a date-only value to the API as noon UTC so local display stays on the same day. */
export function toApiDueDate(dateInput: string): string {
  return `${dateInput}T12:00:00.000Z`;
}

/** Reads an API due date into YYYY-MM-DD for date inputs. */
export function fromApiDueDate(iso: string | null | undefined): string {
  if (!iso) return toDateInputValue();
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(iso);
  if (match) return match[1];
  return toDateInputValue(new Date(iso));
}

/** Displays an API due date without timezone day-shift (DD/MM/YYYY). */
export function formatDueDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const ymd = fromApiDueDate(iso);
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Friendly local label for a YYYY-MM-DD input value. */
export function formatDateInputLabel(dateInput: string): string {
  if (!dateInput) return "";
  const [y, m, d] = dateInput.split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
