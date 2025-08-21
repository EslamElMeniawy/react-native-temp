import { describe, test, expect } from '@jest/globals';
import { QueryClient } from '@tanstack/react-query';
import { queryClient } from '@modules/utils/src/queryClient';

describe('QueryClient', () => {
  test('should export queryClient object correctly', () => {
    expect(queryClient).toBeDefined();
  });

  test('should create a new instance of QueryClient successfully', () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });
});
