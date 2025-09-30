import { FrequencyCategory } from './frequency';
import { GroupByMethod } from './grouping';

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

/**
 * Props for TermSelector component with optional grouping support
 */
export interface TermSelectorProps {
  terms: string[];
  onSelect: (value: string | string[]) => void;
  selected?: string | string[];
  multi?: boolean;
  onNext: () => void;
  onSkip: () => void;
  groupByMethod?: GroupByMethod;
  attributeType?: string;
}