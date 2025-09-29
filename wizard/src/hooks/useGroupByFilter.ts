/**
 * Custom hook for managing Group By filter state with localStorage persistence
 * Feature: 006-below-the-filter
 * Task: T006
 */

import { useState, useEffect, useMemo } from 'react';
import type { GroupByMethod, GroupByState } from '../types/grouping';

const STORAGE_KEY = 'adp-wizard-groupBy-v1';
const CURRENT_VERSION = 1;

/**
 * Load grouping preference from localStorage
 * @returns GroupByMethod or null if no valid data found
 */
function loadFromStorage(): GroupByMethod | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed: GroupByState = JSON.parse(stored);

    // Validate version
    if (parsed.version !== CURRENT_VERSION) {
      return null; // Reset to default for version mismatch
    }

    // Validate method
    if (parsed.method === 'category' || parsed.method === 'popularity') {
      return parsed.method;
    }

    return null;
  } catch (error) {
    // Handle corrupted data or JSON parse errors
    console.warn('Failed to load groupBy preference from localStorage:', error);
    return null;
  }
}

/**
 * Save grouping preference to localStorage
 * @param method - GroupByMethod to save
 */
function saveToStorage(method: GroupByMethod): void {
  try {
    const state: GroupByState = {
      method,
      version: CURRENT_VERSION
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save groupBy preference to localStorage:', error);
  }
}

/**
 * Hook for managing Group By filter state
 * @returns Object with groupByMethod, setGroupByMethod, and computed boolean helpers
 */
export function useGroupByFilter() {
  const [groupByMethod, setGroupByMethodState] = useState<GroupByMethod>(() => {
    // Load from localStorage on mount
    return loadFromStorage() || 'category';
  });

  // Save to localStorage whenever method changes
  useEffect(() => {
    saveToStorage(groupByMethod);
  }, [groupByMethod]);

  // Wrapper to set method (allows for future logic if needed)
  const setGroupByMethod = (method: GroupByMethod) => {
    setGroupByMethodState(method);
  };

  // Computed boolean helpers
  const isCategory = useMemo(() => groupByMethod === 'category', [groupByMethod]);
  const isPopularity = useMemo(() => groupByMethod === 'popularity', [groupByMethod]);

  return {
    groupByMethod,
    setGroupByMethod,
    isCategory,
    isPopularity
  };
}
