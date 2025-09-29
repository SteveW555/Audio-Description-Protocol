/**
 * Interface contract for TermSelector component with reduced height buttons
 */

export interface TermSelectorProps {
  /** Array of terms to display as selectable buttons */
  terms: string[];

  /** Callback when term selection changes */
  onSelect: (value: string | string[]) => void;

  /** Currently selected term(s) */
  selected?: string | string[];

  /** Whether multiple terms can be selected */
  multi?: boolean;

  /** Callback for next button */
  onNext: () => void;

  /** Callback for skip button */
  onSkip: () => void;

  /** Category for frequency-based filtering */
  category?: 'mood' | 'energy' | 'texture';

  /** Whether to enable frequency grouping */
  enableFrequencyGroups?: boolean;

  /** Whether to enable search functionality */
  enableSearch?: boolean;

  /** Whether to use reduced height buttons */
  useReducedHeight?: boolean;
}

export interface TermSelectorState {
  /** Current search query */
  searchQuery: string;

  /** Current frequency filter */
  frequencyFilter: 'all' | 'ubiquitous' | 'frequent' | 'infrequent' | 'rare';

  /** Filtered terms based on search and frequency */
  filteredTerms: string[];
}

/**
 * Button height configuration
 */
export const HEIGHT_CONFIG = {
  /** Normal button height */
  NORMAL: {
    padding: 'py-1.5',
    description: 'Standard height with 12px vertical padding'
  },

  /** Reduced button height (25-30% reduction) */
  REDUCED: {
    padding: 'py-1',
    description: 'Reduced height with 8px vertical padding'
  }
} as const;

/**
 * Layout calculations for button display
 */
export interface ButtonLayoutMetrics {
  /** Expected buttons per row at different screen sizes */
  buttonsPerRow: {
    mobile: number;    // < 640px
    tablet: number;    // 640px - 1024px
    desktop: number;   // > 1024px
  };

  /** Expected height reduction percentage */
  heightReduction: number; // Should be 25-30%

  /** Minimum touch target size (for accessibility) */
  minTouchTarget: number; // 44px minimum
}