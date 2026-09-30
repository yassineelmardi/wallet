import { parsePositiveAmount } from './money';

describe('parsePositiveAmount', () => {
  it.each([
    ['12', 12],
    ['12.50', 12.5],
    ['12,50', 12.5],
    [' 0.75 ', 0.75],
    ['.5', 0.5],
    ['1.', 1],
    [42, 42],
  ])('parses valid positive amount %p', (input, expected) => {
    expect(parsePositiveAmount(input)).toBe(expected);
  });

  it.each([
    '',
    '   ',
    'abc',
    '12abc',
    '1.2.3',
    '1,2.3',
    '1 000',
    '1e3',
    'Infinity',
    'NaN',
    '0',
    '-0.01',
    null,
    undefined,
    Number.POSITIVE_INFINITY,
    Number.NaN,
  ])('rejects invalid amount %p', (input) => {
    expect(parsePositiveAmount(input)).toBeNull();
  });
});