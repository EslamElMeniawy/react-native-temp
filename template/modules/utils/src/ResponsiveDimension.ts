/**
 * Calculates the width based on the percentage of the full width.
 *
 * @param fullWidth The full width value.
 * @param percent The percentage value (optional). Must be between 0 and 100.
 * @returns The calculated width based on the percentage provided. If no percentage is provided, defaults to 100%.
 * @throws {Error} When fullWidth is a negative number.
 * @throws {Error} When percent is a negative number.
 * @throws {Error} When percent is greater than 100.
 */ export const percentWidth = (fullWidth: number, percent?: number) => {
  if (fullWidth < 0) {
    throw new Error('fullWidth must be positive numbers.');
  }

  if (percent !== undefined && percent < 0) {
    throw new Error('percent must be positive numbers.');
  }

  if (percent !== undefined && percent > 100) {
    throw new Error('percent must be less than or equal to 100.');
  }

  return fullWidth * ((percent ?? 100) / 100);
};

/**
 * Calculates the height based on the percentage of the full height.
 *
 * @param fullHeight The full height value.
 * @param percent The percentage value (optional). Must be between 0 and 100.
 * @returns The calculated height based on the percentage provided. If no percentage is provided, defaults to 100%.
 * @throws {Error} When fullHeight is a negative number.
 * @throws {Error} When percent is a negative number.
 * @throws {Error} When percent is greater than 100.
 */
export const percentHeight = (fullHeight: number, percent?: number) => {
  if (fullHeight < 0) {
    throw new Error('fullHeight must be positive numbers.');
  }

  if (percent !== undefined && percent < 0) {
    throw new Error('percent must be positive numbers.');
  }

  if (percent !== undefined && percent > 100) {
    throw new Error('percent must be less than or equal to 100.');
  }

  return fullHeight * ((percent ?? 100) / 100);
};
