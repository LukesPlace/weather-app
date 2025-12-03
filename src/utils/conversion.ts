export function cToF(celsius: number): number {
  return round((celsius * 9) / 5 + 32);
}

export function kmhToMph(kmh: number): number {
  return round(kmh * 0.621371);
}

export function mmToInches(mm: number): number {
  return round(mm / 25.4);
}

export function round(value: number, dp: number = 1): number {
  return Number(value.toFixed(dp));
}
