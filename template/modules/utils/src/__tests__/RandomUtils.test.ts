import { describe, test, expect } from '@jest/globals';
import { randomIntFromInterval } from '@modules/utils/src/RandomUtils';

describe('RandomUtils', () => {
  test('should return an integer within the specified range', () => {
    const result = randomIntFromInterval(5, 15);
    expect(result).toBeGreaterThanOrEqual(5);
    expect(result).toBeLessThanOrEqual(15);
    expect(Number.isInteger(result)).toBe(true);
  });

  test('should throw an error when min is greater than max', () => {
    expect(() => {
      randomIntFromInterval(10, 1);
    }).toThrow(
      'Minimum value must be less than or equal to the maximum value.',
    );
  });

  test('should return an integer within the specified range when given large min and max values', () => {
    const result = randomIntFromInterval(1000000, 10000000);
    expect(result).toBeGreaterThanOrEqual(1000000);
    expect(result).toBeLessThanOrEqual(10000000);
    expect(Number.isInteger(result)).toBe(true);
  });

  test('should return the same value when min equals max', () => {
    const result = randomIntFromInterval(5, 5);
    expect(result).toBe(5);
  });

  test('should return an integer when given non-integer min and max values', () => {
    const result = randomIntFromInterval(1.5, 10.7);
    expect(Number.isInteger(result)).toBe(true);
  });

  test('should handle negative min and max values correctly', () => {
    expect(() => randomIntFromInterval(-5, 10)).toThrow(
      'Minimum value must be positive numbers.',
    );
    expect(() => randomIntFromInterval(5, -10)).toThrow(
      'Maximum value must be positive numbers.',
    );
  });

  test('should return an integer when min and max values are zero', () => {
    const result = randomIntFromInterval(0, 0);
    expect(Number.isInteger(result)).toBe(true);
  });
});
