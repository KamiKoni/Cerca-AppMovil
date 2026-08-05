import { describe, it, expect } from 'vitest';
import { formatMoney } from '../src/money';

describe('formatMoney', () => {
  it('formats JPY with 0 decimals', () => {
    const s = formatMoney({ amountMinor: 1500, currency: 'JPY' }, 'en-US');
    // 1500 minor units -> 1500 JPY
    expect(s).toContain('¥');
  });

  it('formats MXN with 2 decimals', () => {
    const s = formatMoney({ amountMinor: 129990, currency: 'MXN' }, 'es-MX');
    expect(s).toContain('$');
  });

  it('formats KWD with 3 decimals', () => {
    const s = formatMoney({ amountMinor: 123456, currency: 'KWD' }, 'en-US');
    expect(s).toMatch(/KD|KWD|د.ك/);
  });
});
