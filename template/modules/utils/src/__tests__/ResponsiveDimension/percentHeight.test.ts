import {describe, test, expect} from '@jest/globals';
import {percentHeight} from '@modules/utils/src/ResponsiveDimension';

describe('ResponsiveDimension `percentHeight`', () => {
  test('should calculate the correct height when a valid percent is provided', () => {
    expect(percentHeight(200, 50)).toBe(100);
  });

  test('should throw an error when fullHeight is negative', () => {
    expect(() => percentHeight(-100, 50)).toThrow(
      'fullHeight must be positive numbers.',
    );
  });

  test('should return full height when no percent is provided', () => {
    expect(percentHeight(200)).toBe(200);
  });

  test('should calculate the correct height when percent is exactly 0', () => {
    expect(percentHeight(200, 0)).toBe(0);
  });

  test('should calculate the correct height when percent is exactly 100', () => {
    expect(percentHeight(200, 100)).toBe(200);
  });

  test('should throw an error when percent is negative', () => {
    expect(() => percentHeight(200, -50)).toThrow(
      'percent must be positive numbers.',
    );
  });

  test('should throw an error when percent is greater than 100', () => {
    expect(() => percentHeight(200, 110)).toThrowError(
      'percent must be less than or equal to 100.',
    );
  });

  test('should maintain precision for very small percent values', () => {
    expect(percentHeight(1000, 0.0001)).toBeCloseTo(0.001, 5);
  });

  test('should calculate the correct height as a floating point number when necessary', () => {
    expect(percentHeight(150, 75)).toBeCloseTo(112.5);
  });

  test('should calculate the correct height when floating point values are provided', () => {
    expect(percentHeight(150.5, 33.3)).toBeCloseTo(50.115);
  });

  test('should return 0 when fullHeight is 0 regardless of percent', () => {
    expect(percentHeight(0)).toBe(0);
  });
});
