/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 *
 * @param {number} min - The minimum value for the random integer.
 * @param {number} max - The maximum value for the random integer.
 * @returns {number} A random integer between min and max (inclusive).
 * @throws {Error} If the minimum value is negative, maximum value is negative, or minimum value is greater than the maximum value.
 */
export const randomIntFromInterval = (min: number, max: number): number => {
  if (min < 0) {
    throw new Error('Minimum value must be positive numbers.');
  }

  if (max < 0) {
    throw new Error('Maximum value must be positive numbers.');
  }

  if (min > max) {
    throw new Error(
      'Minimum value must be less than or equal to the maximum value.',
    );
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
};
