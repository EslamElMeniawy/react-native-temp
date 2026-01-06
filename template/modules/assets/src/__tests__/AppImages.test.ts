import { describe, expect, it } from '@jest/globals';

import AppImages from '@modules/assets/src/AppImages';

describe('AppImages', () => {
  it('has bootSplashImage', () => {
    expect(AppImages.bootSplashImage).toBeDefined();
  });

  it('has logo', () => {
    expect(AppImages.logo).toBeDefined();
  });
});
