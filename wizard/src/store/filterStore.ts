import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FilterStore, StoredFilterState } from '../types/filter';
import { FrequencyCategory } from '../types/frequency';

const STORAGE_KEY = 'adp-frequency-filter';
const STORAGE_VERSION = '2.0.0';

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      // State - default to 'all' selected
      selectedFrequencies: ['all'] as FrequencyCategory[],

      // Actions
      toggleFrequency: (frequency: FrequencyCategory) => {
        const current = get().selectedFrequencies;

        if (frequency === 'all') {
          // If 'all' is clicked, deselect everything else and select only 'all'
          set({ selectedFrequencies: ['all'] });
        } else {
          // If a specific frequency is clicked
          if (current.includes(frequency)) {
            // If it's already selected, remove it
            const newSelection = current.filter(f => f !== frequency);
            // If nothing is selected, default to 'all'
            set({ selectedFrequencies: newSelection.length === 0 ? ['all'] : newSelection });
          } else {
            // If it's not selected, add it and remove 'all'
            const newSelection = [...current.filter(f => f !== 'all'), frequency];
            set({ selectedFrequencies: newSelection });
          }
        }
      },

      resetFilter: () => {
        set({ selectedFrequencies: ['all'] });
      },

      // Computed
      isFiltered: () => {
        const frequencies = get().selectedFrequencies;
        return frequencies.length !== 1 || frequencies[0] !== 'all';
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      version: 2,
      migrate: (persistedState: any, version: number) => {
        // Handle migration from version 1 (single selection) to version 2 (multiple selections)
        if (version === 1 && persistedState.selectedFrequency) {
          return {
            selectedFrequencies: persistedState.selectedFrequency === 'all'
              ? ['all']
              : [persistedState.selectedFrequency]
          };
        }
        if (version !== 2) {
          // Reset to default state for incompatible versions
          return { selectedFrequencies: ['all'] };
        }
        return persistedState as FilterStore;
      },
      partialize: (state) => ({
        selectedFrequencies: state.selectedFrequencies,
      }),
    }
  )
);

// Helper to manually save state with metadata
export const saveFilterState = (state: FilterStore): void => {
  try {
    const storedState: StoredFilterState = {
      version: STORAGE_VERSION,
      selectedFrequencies: state.selectedFrequencies,
      lastUpdated: new Date().toISOString(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(storedState));
  } catch (error) {
    // Silently fail if storage is unavailable
    console.warn('Failed to save filter state:', error);
  }
};

// Helper to load state with version checking
export const loadFilterState = (): FrequencyCategory[] | null => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as any;

    // Check version compatibility and migrate if needed
    if (parsed.version === '1.0.0' && parsed.selectedFrequency) {
      // Migrate from v1 to v2
      return parsed.selectedFrequency === 'all' ? ['all'] : [parsed.selectedFrequency];
    }

    if (parsed.version !== STORAGE_VERSION) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed.selectedFrequencies;
  } catch (error) {
    // Return null on any error
    console.warn('Failed to load filter state:', error);
    return null;
  }
};