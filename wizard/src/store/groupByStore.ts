import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GroupByMethod } from '../types/grouping';

interface GroupByStore {
  groupByMethod: GroupByMethod;
  setGroupByMethod: (method: GroupByMethod) => void;
  isCategory: () => boolean;
  isPopularity: () => boolean;
}

const STORAGE_KEY = 'adp-wizard-groupBy-v1';

export const useGroupByStore = create<GroupByStore>()(
  persist(
    (set, get) => ({
      // State - default to 'category'
      groupByMethod: 'category',

      // Actions
      setGroupByMethod: (method: GroupByMethod) => {
        set({ groupByMethod: method });
      },

      // Computed
      isCategory: () => get().groupByMethod === 'category',
      isPopularity: () => get().groupByMethod === 'popularity',
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Only accept version 1 data - reset to default for any other version
        if (version !== 1) {
          return { groupByMethod: 'category' };
        }
        return persistedState as GroupByStore;
      },
      partialize: (state) => ({
        groupByMethod: state.groupByMethod,
      }),
    }
  )
);
