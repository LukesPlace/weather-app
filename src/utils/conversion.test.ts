import { describe, it, expect } from 'vitest';
import { cToF, kmhToMph, mmToInches, round } from './conversion';

describe('round()', () => {
  it('rounds to nearest integer by default', () => {
    expect(round(4.4)).toBe(4);
    expect(round(4.5)).toBe(5);
  });

  it('rounds to fixed decimals', () => {
    expect(round(1.2345, 2)).toBe(1.23);
    expect(round(1.2355, 2)).toBe(1.24);
  });

  it('returns 0 for non-finite numbers', () => {
    expect(round(Infinity)).toBe(0);
    expect(round(NaN)).toBe(0);
  });

  it('does not return -0', () => {
    expect(Object.is(round(-0), -0)).toBe(false);
    expect(round(-0)).toBe(0);
  });
});

describe('cToF()', () => {
  it('converts Celsius to Fahrenheit correctly', () => {
    expect(cToF(0)).toBe(32);
    expect(cToF(100)).toBe(212);
    expect(cToF(-40)).toBe(-40); // special case
  });

  it('uses rounding', () => {
    expect(cToF(36.6)).toBe(98);
  });
});

describe('kmhToMph()', () => {
  it('converts km/h to mph correctly', () => {
    expect(kmhToMph(0)).toBe(0);
    expect(kmhToMph(100)).toBe(62); // 62.1371 → 62
  });

  it('never returns negative values', () => {
    expect(kmhToMph(-10)).toBe(0);
  });
});

describe('mmToInches()', () => {
  it('converts mm to inches correctly (2 decimals)', () => {
    expect(mmToInches(25.4)).toBe(1);        // exactly 1 inch
    expect(mmToInches(50)).toBe(1.97);       // 1.9685 → 1.97
  });

  it('never returns negative values', () => {
    expect(mmToInches(-5)).toBe(0);
  });

  it('rounds to 2 decimals', () => {
    expect(mmToInches(12.7)).toBe(0.5);      // exactly 0.5
  });
});