/**
 * Interface contract for TooltipWrapper component for text overflow handling
 */

import { ReactNode } from 'react';

export interface TooltipWrapperProps {
  /** The content to display in the tooltip */
  content: string;

  /** The child component to wrap with tooltip functionality */
  children: ReactNode;

  /** Position of the tooltip relative to the trigger */
  position?: 'top' | 'bottom' | 'left' | 'right';

  /** Whether to show tooltip on hover */
  showOnHover?: boolean;

  /** Whether to show tooltip on focus (for accessibility) */
  showOnFocus?: boolean;

  /** Additional CSS classes for the tooltip */
  tooltipClassName?: string;

  /** Delay before showing tooltip (in milliseconds) */
  delay?: number;
}

export interface TooltipState {
  /** Whether the tooltip is currently visible */
  isVisible: boolean;

  /** Current trigger that activated the tooltip */
  trigger?: 'hover' | 'focus' | 'none';
}

/**
 * CSS class constants for tooltip styling
 */
export const TOOLTIP_STYLES = {
  /** Container classes */
  CONTAINER: 'relative inline-block',

  /** Tooltip content base classes */
  CONTENT_BASE: 'absolute z-10 px-2 py-1 text-xs text-white bg-gray-900 rounded-md shadow-lg',

  /** Position-specific classes */
  POSITIONS: {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-1',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-1',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-1',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-1'
  },

  /** Animation classes */
  ENTER: 'opacity-0 scale-95',
  ENTER_ACTIVE: 'opacity-100 scale-100 transition-all duration-200',
  EXIT: 'opacity-100 scale-100',
  EXIT_ACTIVE: 'opacity-0 scale-95 transition-all duration-150'
} as const;