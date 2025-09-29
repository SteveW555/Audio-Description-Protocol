import { FrequencyCategory } from './frequency';

export interface FilterState {
  selectedFrequencies: FrequencyCategory[];
}

export interface Term {
  value: string;
  frequency?: Exclude<FrequencyCategory, 'all'>; // 'all' is filter-only
}

export type FilterAvailability = Map<FrequencyCategory, {
  available: boolean;
  count: number;
  label: string;
}>;

export interface FrequencyFilterProps {
  terms: Term[];
  className?: string;
}

export interface UseFrequencyFilterResult {
  selectedFrequencies: FrequencyCategory[];
  toggleFrequency: (frequency: FrequencyCategory) => void;
  filterTerms: (terms: Term[]) => string[];
  getAvailability: (terms: Term[]) => FilterAvailability;
}

export interface FilterStore extends FilterState {
  toggleFrequency: (frequency: FrequencyCategory) => void;
  resetFilter: () => void;
  isFiltered: () => boolean;
}

export interface StoredFilterState {
  version: '2.0.0';
  selectedFrequencies: FrequencyCategory[];
  lastUpdated: string;
}