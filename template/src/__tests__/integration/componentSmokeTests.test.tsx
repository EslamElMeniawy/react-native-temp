/**
 * Integration test: Component rendering with real Material Design 3 theme.
 *
 * Tests that PaperProvider and MD3 theme APIs work correctly after upgrades.
 * Verifies theme structure, provider rendering, and useTheme hook.
 */
import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  useTheme,
} from 'react-native-paper';

// Suppress console noise
jest.spyOn(console, 'info').mockImplementation(() => {});

describe('Component Smoke Tests - PaperProvider + MD3 Theme', () => {
  describe('MD3 Theme structure', () => {
    it('MD3LightTheme has expected color properties', () => {
      expect(MD3LightTheme.colors.primary).toBeDefined();
      expect(MD3LightTheme.colors.background).toBeDefined();
      expect(MD3LightTheme.colors.surface).toBeDefined();
      expect(MD3LightTheme.colors.error).toBeDefined();
      expect(MD3LightTheme.colors.onPrimary).toBeDefined();
      expect(MD3LightTheme.colors.onBackground).toBeDefined();
      expect(MD3LightTheme.colors.onSurface).toBeDefined();
    });

    it('MD3DarkTheme has expected color properties', () => {
      expect(MD3DarkTheme.colors.primary).toBeDefined();
      expect(MD3DarkTheme.colors.background).toBeDefined();
      expect(MD3DarkTheme.colors.surface).toBeDefined();
      expect(MD3DarkTheme.colors.error).toBeDefined();
    });

    it('themes have dark property', () => {
      expect(MD3LightTheme.dark).toBe(false);
      expect(MD3DarkTheme.dark).toBe(true);
    });

    it('themes have fonts configuration', () => {
      expect(MD3LightTheme.fonts).toBeDefined();
      expect(MD3LightTheme.fonts.bodyLarge).toBeDefined();
      expect(MD3LightTheme.fonts.titleMedium).toBeDefined();
    });

    it('theme colors are valid hex/rgb strings', () => {
      const colorPattern = /^(#[0-9a-fA-F]{6,8}|rgb|hsl)/;
      expect(MD3LightTheme.colors.primary).toMatch(colorPattern);
      expect(MD3LightTheme.colors.background).toMatch(colorPattern);
      expect(MD3LightTheme.colors.error).toMatch(colorPattern);
    });

    it('light and dark themes have different background colors', () => {
      expect(MD3LightTheme.colors.background).not.toBe(
        MD3DarkTheme.colors.background,
      );
    });
  });

  describe('PaperProvider rendering', () => {
    it('renders children inside PaperProvider', async () => {
      await render(
        <PaperProvider theme={MD3LightTheme}>
          <View testID="child">
            <Text>Hello</Text>
          </View>
        </PaperProvider>,
      );
      expect(screen.getByTestId('child')).toBeTruthy();
    });

    it('renders with dark theme', async () => {
      await render(
        <PaperProvider theme={MD3DarkTheme}>
          <View testID="dark-child">
            <Text>Dark mode</Text>
          </View>
        </PaperProvider>,
      );
      expect(screen.getByTestId('dark-child')).toBeTruthy();
    });

    it('renders with custom theme extending MD3', async () => {
      const customTheme = {
        ...MD3LightTheme,
        colors: {
          ...MD3LightTheme.colors,
          primary: '#ff0000',
        },
      };

      await render(
        <PaperProvider theme={customTheme}>
          <View testID="custom-themed">
            <Text>Custom</Text>
          </View>
        </PaperProvider>,
      );
      expect(screen.getByTestId('custom-themed')).toBeTruthy();
    });
  });

  describe('useTheme hook', () => {
    function ThemeConsumer() {
      const theme = useTheme();
      return (
        <View testID="theme-consumer">
          <Text testID="theme-primary">{theme.colors.primary}</Text>
          <Text testID="theme-background">{theme.colors.background}</Text>
        </View>
      );
    }

    it('provides theme colors to children via useTheme', async () => {
      await render(
        <PaperProvider theme={MD3LightTheme}>
          <ThemeConsumer />
        </PaperProvider>,
      );

      expect(screen.getByTestId('theme-consumer')).toBeTruthy();
      expect(screen.getByTestId('theme-primary').props.children).toBe(
        MD3LightTheme.colors.primary,
      );
    });

    it('useTheme returns theme with colors object', async () => {
      await render(
        <PaperProvider theme={MD3DarkTheme}>
          <ThemeConsumer />
        </PaperProvider>,
      );

      const background = screen.getByTestId('theme-background').props.children;
      // useTheme should return a string color value (hex or rgb)
      expect(background).toMatch(/^(#[0-9a-fA-F]{6,8}|rgb)/);
    });

    it('useTheme returns theme with background color', async () => {
      await render(
        <PaperProvider theme={MD3LightTheme}>
          <ThemeConsumer />
        </PaperProvider>,
      );

      const background = screen.getByTestId('theme-background').props.children;
      expect(typeof background).toBe('string');
      expect(background.length).toBeGreaterThan(0);
    });
  });

  describe('react-native-paper API contract', () => {
    it('exports PaperProvider', () => {
      expect(typeof PaperProvider).toBe('function');
    });

    it('exports useTheme hook', () => {
      expect(typeof useTheme).toBe('function');
    });

    it('exports MD3LightTheme and MD3DarkTheme', () => {
      expect(MD3LightTheme).toBeDefined();
      expect(MD3DarkTheme).toBeDefined();
    });

    it('theme roundTrips property has expected shape', () => {
      expect(MD3LightTheme).toHaveProperty('colors');
      expect(MD3LightTheme).toHaveProperty('dark');
      expect(MD3LightTheme).toHaveProperty('fonts');
      expect(MD3LightTheme).toHaveProperty('roundness');
    });
  });
});
