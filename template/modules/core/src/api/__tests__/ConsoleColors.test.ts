import { describe, expect, it } from '@jest/globals';

import ConsoleColors from '@modules/core/src/api/ConsoleColors';

describe('ConsoleColors', () => {
  it('has get color', () => {
    expect(ConsoleColors.get).toBe('#6BDD9A');
  });

  it('has post color', () => {
    expect(ConsoleColors.post).toBe('#FFE47E');
  });

  it('has put color', () => {
    expect(ConsoleColors.put).toBe('#74AEF6');
  });

  it('has patch color', () => {
    expect(ConsoleColors.patch).toBe('#C0A8E1');
  });

  it('has delete color', () => {
    expect(ConsoleColors.delete).toBe('#F79A8E');
  });

  it('has options color', () => {
    expect(ConsoleColors.options).toBe('#F15EB0');
  });

  it('has url color', () => {
    expect(ConsoleColors.url).toBe('#F09B51');
  });

  it('has head color', () => {
    expect(ConsoleColors.head).toBe('#79E0A4');
  });
});
