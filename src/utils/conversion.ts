export function cToF(celsius: number): number {
  return round((celsius * 9) / 5 + 32);
}

export function kmhToMph(kmh: number): number {
  return Math.max(round(kmh * 0.621371));
}

export function mmToInches(mm: number): number {
  return Math.max(round(mm / 25.4, 2), 0);
}

export function round(value: number, decimals = 0): number {
  if (!Number.isFinite(value)) return 0;

  const factor = Math.pow(10, decimals);
  const result = Math.round(value * factor) / factor;

  // Prevent returning -0
  return result === 0 ? 0 : result;
}