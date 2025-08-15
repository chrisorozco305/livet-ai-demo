export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export const toPct = (x: number) => Math.round(clamp(x, 0, 1) * 100);

export function riskPct(pledge_value: number, projected_sales: number, break_even_cost: number) {
  const r = 1 - (pledge_value + projected_sales) / break_even_cost;
  return Math.round(clamp(r, 0, 1) * 100);
}

// tiny “demand nudger” for demo pricing
export function fairPriceFromFDI(min: number, cap: number, fdi: number) {
  const raw = min + 6 * (fdi - 0.5);  // tweak 6 if too jumpy
  return clamp(raw, min, cap);
}
