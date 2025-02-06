import {describe, test, expect} from '@jest/globals';
import {percentWidth} from '@modules/utils/src/ResponsiveDimension';

describe('ResponsiveDimension `percentWidth`', () => {
  test('should calculate the correct width when a valid percent is provided', () => {
    expect(percentWidth(200, 50)).toBe(100);
  });

  test('should throw an error when fullWidth is negative', () => {
    expect(() => percentWidth(-100, 50)).toThrow(
      'fullWidth must be positive numbers.',
    );
  });

  test('should return full width when no percent is provided', () => {
    expect(percentWidth(200)).toBe(200);
  });

  test('should calculate the correct width when percent is exactly 0', () => {
    expect(percentWidth(200, 0)).toBe(0);
  });

  test('should calculate the correct width when percent is exactly 100', () => {
    expect(percentWidth(200, 100)).toBe(200);
  });

  test('should throw an error when percent is negative', () => {
    expect(() => percentWidth(200, -50)).toThrow(
      'percent must be positive numbers.',
    );
  });

  test('should throw an error when percent is greater than 100', () => {
    expect(() => percentWidth(200, 110)).toThrowError(
      'percent must be less than or equal to 100.',
    );
  });

  test('should maintain precision for very small percent values', () => {
    expect(percentWidth(1000, 0.0001)).toBeCloseTo(0.001, 5);
  });

  test('should calculate the correct width as a floating point number when necessary', () => {
    expect(percentWidth(150, 75)).toBeCloseTo(112.5);
  });

  test('should calculate the correct width when floating point values are provided', () => {
    expect(percentWidth(150.5, 33.3)).toBeCloseTo(50.115);
  });

  test('should return 0 when fullWidth is 0 regardless of percent', () => {
    expect(percentWidth(0)).toBe(0);
  });
});
