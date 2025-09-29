import { useCallback, useMemo } from 'react';
import { useFilterStore } from '../store/filterStore';
import { Term, FilterAvailability, UseFrequencyFilterResult } from '../types/filter';
import { FrequencyCategory } from '../types/frequency';

export const useFrequencyFilter = (): UseFrequencyFilterResult => {
  const { selectedFrequencies, toggleFrequency } = useFilterStore();

  const filterTerms = useCallback(
    (terms: Term[]): string[] => {
      // If 'all' is selected, return all term values
      if (selectedFrequencies.includes('all')) {
        return terms.map(term => term.value);
      }

      // Otherwise filter by selected frequencies
      return terms
        .filter(term => {
          // Include terms whose frequency is in the selected list
          return term.frequency && selectedFrequencies.includes(term.frequency);
        })
        .map(term => term.value);
    },
    [selectedFrequencies]
  );

  const getAvailability = useCallback(
    (terms: Term[]): FilterAvailability => {
      const availability = new Map<FrequencyCategory, {
        available: boolean;
        count: number;
        label: string;
      }>();

      // Initialize all categories
      const categories: FrequencyCategory[] = ['all', 'ubiquitous', 'frequent', 'infrequent', 'rare'];

      categories.forEach(category => {
        if (category === 'all') {
          // 'all' includes everything
          availability.set(category, {
            available: true,
            count: terms.length,
            label: 'All',
          });
        } else {
          // Count terms with this specific frequency
          const count = terms.filter(term => term.frequency === category).length;
          const available = count > 0;
          const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);

          availability.set(category, {
            available,
            count,
            label: available ? capitalizedCategory : `No ${capitalizedCategory} Available`,
          });
        }
      });

      return availability;
    },
    []
  );

  return useMemo(
    () => ({
      selectedFrequencies,
      toggleFrequency,
      filterTerms,
      getAvailability,
    }),
    [selectedFrequencies, toggleFrequency, filterTerms, getAvailability]
  );
};