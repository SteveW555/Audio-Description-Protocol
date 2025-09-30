/**
 * Tests for useGroupByFilter hook
 * Feature: 006-below-the-filter
 * Task: T005
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGroupByFilter } from '../../src/hooks/useGroupByFilter';
import { useGroupByStore } from '../../src/store/groupByStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useGroupByFilter hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Force persist middleware to rehydrate from storage (will use default since storage is empty)
    useGroupByStore.persist.rehydrate();
  });

  describe('Hook interface', () => {
    it('should return correct interface shape', () => {
      const { result } = renderHook(() => useGroupByFilter());

      expect(result.current).toHaveProperty('groupByMethod');
      expect(result.current).toHaveProperty('setGroupByMethod');
      expect(result.current).toHaveProperty('isCategory');
      expect(result.current).toHaveProperty('isPopularity');
    });

    it('should have correct types for return values', () => {
      const { result } = renderHook(() => useGroupByFilter());

      expect(typeof result.current.groupByMethod).toBe('string');
      expect(typeof result.current.setGroupByMethod).toBe('function');
      expect(typeof result.current.isCategory).toBe('boolean');
      expect(typeof result.current.isPopularity).toBe('boolean');
    });
  });

  describe('Default state', () => {
    it('should default to "category" grouping', () => {
      const { result } = renderHook(() => useGroupByFilter());

      expect(result.current.groupByMethod).toBe('category');
      expect(result.current.isCategory).toBe(true);
      expect(result.current.isPopularity).toBe(false);
    });
  });

  describe('setGroupByMethod function', () => {
    it('should switch from category to popularity', () => {
      const { result } = renderHook(() => useGroupByFilter());

      act(() => {
        result.current.setGroupByMethod('popularity');
      });

      expect(result.current.groupByMethod).toBe('popularity');
      expect(result.current.isCategory).toBe(false);
      expect(result.current.isPopularity).toBe(true);
    });

    it('should switch from popularity to category', () => {
      const { result } = renderHook(() => useGroupByFilter());

      act(() => {
        result.current.setGroupByMethod('popularity');
      });

      act(() => {
        result.current.setGroupByMethod('category');
      });

      expect(result.current.groupByMethod).toBe('category');
      expect(result.current.isCategory).toBe(true);
      expect(result.current.isPopularity).toBe(false);
    });
  });

  describe('localStorage persistence', () => {
    const STORAGE_KEY = 'adp-wizard-groupBy-v1';

    it('should save to localStorage on method change', () => {
      const { result } = renderHook(() => useGroupByFilter());

      act(() => {
        result.current.setGroupByMethod('popularity');
      });

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      // Zustand persist format: {state: {...}, version: N}
      expect(parsed.state.groupByMethod).toBe('popularity');
      expect(parsed.version).toBe(1);
    });

    it('should load from localStorage on mount', () => {
      // Pre-populate localStorage with Zustand persist format
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ state: { groupByMethod: 'popularity' }, version: 1 })
      );
      // Force rehydration from storage
      useGroupByStore.persist.rehydrate();

      const { result } = renderHook(() => useGroupByFilter());

      expect(result.current.groupByMethod).toBe('popularity');
      expect(result.current.isPopularity).toBe(true);
    });

    it('should handle missing localStorage data', () => {
      // No data in localStorage
      const { result } = renderHook(() => useGroupByFilter());

      expect(result.current.groupByMethod).toBe('category');
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-json');

      const { result } = renderHook(() => useGroupByFilter());

      // Should fallback to default
      expect(result.current.groupByMethod).toBe('category');
    });
  });

  describe('Version migration', () => {
    const STORAGE_KEY = 'adp-wizard-groupBy-v1';

    it('should reset to default if stored version is not 1', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ state: { groupByMethod: 'popularity' }, version: 2 })
      );

      const { result } = renderHook(() => useGroupByFilter());

      // Should reset to default due to version mismatch
      expect(result.current.groupByMethod).toBe('category');
    });

    it('should reset to default if version field is missing', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ state: { groupByMethod: 'popularity' } })
      );

      const { result } = renderHook(() => useGroupByFilter());

      expect(result.current.groupByMethod).toBe('category');
    });

    it('should accept version 1 data', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ state: { groupByMethod: 'popularity' }, version: 1 })
      );
      // Force rehydration from storage
      useGroupByStore.persist.rehydrate();

      const { result } = renderHook(() => useGroupByFilter());

      expect(result.current.groupByMethod).toBe('popularity');
    });
  });

  describe('State persistence across re-renders', () => {
    it('should maintain state across re-renders', () => {
      const { result, rerender } = renderHook(() => useGroupByFilter());

      act(() => {
        result.current.setGroupByMethod('popularity');
      });

      rerender();

      expect(result.current.groupByMethod).toBe('popularity');
    });
  });

  describe('Computed values', () => {
    it('should update isCategory and isPopularity correctly', () => {
      const { result } = renderHook(() => useGroupByFilter());

      // Initial state
      expect(result.current.isCategory).toBe(true);
      expect(result.current.isPopularity).toBe(false);

      // After switching to popularity
      act(() => {
        result.current.setGroupByMethod('popularity');
      });

      expect(result.current.isCategory).toBe(false);
      expect(result.current.isPopularity).toBe(true);

      // After switching back to category
      act(() => {
        result.current.setGroupByMethod('category');
      });

      expect(result.current.isCategory).toBe(true);
      expect(result.current.isPopularity).toBe(false);
    });
  });
});
