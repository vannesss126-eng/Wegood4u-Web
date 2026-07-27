/**
 * Windowed page list: first, last, and a 3-wide window around the current page,
 * with "…" for gaps — e.g. 1 2 3 … 9 · 1 … 4 5 6 … 9 · 1 … 7 8 9. Scales to any
 * page count. Shared by the /our-partners directory and the /news index so their
 * pagination behaves identically.
 */
export function pageWindow(current: number, total: number): (number | "…")[] {
  const size = 3;
  const end = Math.min(total, Math.max(current + 1, size));
  const start = Math.max(1, end - size + 1);
  const set = new Set<number>([1, total]);
  for (let i = start; i <= end; i++) set.add(i);
  const sorted = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("…");
    out.push(sorted[i]);
  }
  return out;
}
