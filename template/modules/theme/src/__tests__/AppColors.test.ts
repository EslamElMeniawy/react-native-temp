import { describe, expect, it } from '@jest/globals';

import { AppColors } from '@modules/theme';

describe('AppColors', () => {
  describe('helper colors', () => {
    it('should define transparent color', () => {
      expect(AppColors.transparent).toBe('transparent');
    });

    it('should define seed color', () => {
      expect(AppColors.seed).toBe('#6750A4');
    });
  });

  describe('light theme colors', () => {
    it('should define primary colors', () => {
      expect(AppColors.themeLight.primary).toBe('#6750A4');
      expect(AppColors.themeLight.onPrimary).toBe('#FFFFFF');
      expect(AppColors.themeLight.primaryContainer).toBe('#EADDFF');
    });

    it('should define background and surface colors', () => {
      expect(AppColors.themeLight.background).toBe('#FFFBFE');
      expect(AppColors.themeLight.surface).toBe('#FFFBFE');
    });

    it('should define error color', () => {
      expect(AppColors.themeLight.error).toBe('#B3261E');
    });

    it('should have elevation levels', () => {
      expect(AppColors.themeLight.elevation.level0).toBe('transparent');
      expect(AppColors.themeLight.elevation.level1).toBe('rgb(247, 242, 250)');
      expect(AppColors.themeLight.elevation.level5).toBe('rgb(234, 227, 242)');
    });

    it('should define backdrop color', () => {
      expect(AppColors.themeLight.backdrop).toBe('rgba(50, 47, 56, 0.4)');
    });
  });

  describe('dark theme colors', () => {
    it('should define primary colors', () => {
      expect(AppColors.themeDark.primary).toBe('#D0BCFF');
      expect(AppColors.themeDark.onPrimary).toBe('#381E72');
      expect(AppColors.themeDark.primaryContainer).toBe('#4F378B');
    });

    it('should define background and surface colors', () => {
      expect(AppColors.themeDark.background).toBe('#1C1B1F');
      expect(AppColors.themeDark.surface).toBe('#1C1B1F');
    });

    it('should define error color', () => {
      expect(AppColors.themeDark.error).toBe('#F2B8B5');
    });

    it('should have elevation levels', () => {
      expect(AppColors.themeDark.elevation.level0).toBe('transparent');
      expect(AppColors.themeDark.elevation.level1).toBe('rgb(37, 35, 41)');
      expect(AppColors.themeDark.elevation.level5).toBe('rgb(53, 50, 62)');
    });

    it('should define backdrop color', () => {
      expect(AppColors.themeDark.backdrop).toBe('rgba(50, 47, 56, 0.4)');
    });
  });
});
