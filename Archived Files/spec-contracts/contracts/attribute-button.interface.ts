/**
 * Interface contract for AttributeButton component with reduced height
 */

export interface AttributeButtonProps {
  /** The text content displayed on the button */
  text: string;

  /** Whether the button is currently selected */
  isSelected: boolean;

  /** Whether the button is disabled/non-interactive */
  isDisabled?: boolean;

  /** Click handler for button selection */
  onClick: (text: string) => void;

  /** Additional CSS classes to apply */
  className?: string;

  /** Whether to use reduced height styling */
  useReducedHeight?: boolean;
}

export interface AttributeButtonState {
  /** Current selection state */
  isSelected: boolean;

  /** Current hover state for tooltip display */
  isHovered: boolean;

  /** Current focus state for accessibility */
  isFocused: boolean;
}

/**
 * CSS class constants for button styling
 */
export const BUTTON_STYLES = {
  /** Original height padding */
  NORMAL_HEIGHT: 'py-1.5',

  /** Reduced height padding (25-30% reduction) */
  REDUCED_HEIGHT: 'py-1',

  /** Base button classes */
  BASE: 'px-3 text-sm font-medium rounded-full transition-all duration-200 break-words',

  /** Selected state classes */
  SELECTED: 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300 dark:ring-blue-500',

  /** Unselected state classes */
  UNSELECTED: 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
} as const;