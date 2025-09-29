/**
 * Tests for GroupByFilter component
 * Feature: 006-below-the-filter
 * Task: T007
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroupByFilter } from '../../src/components/GroupByFilter';
import * as useGroupByFilterModule from '../../src/hooks/useGroupByFilter';

describe('GroupByFilter component', () => {
  const mockSetGroupByMethod = vi.fn();

  beforeEach(() => {
    mockSetGroupByMethod.mockClear();

    // Mock the hook to return controlled values
    vi.spyOn(useGroupByFilterModule, 'useGroupByFilter').mockReturnValue({
      groupByMethod: 'category',
      setGroupByMethod: mockSetGroupByMethod,
      isCategory: true,
      isPopularity: false
    });
  });

  describe('Rendering', () => {
    it('should render two buttons: Category and Popularity', () => {
      render(<GroupByFilter />);

      const categoryButton = screen.getByRole('button', { name: /category/i });
      const popularityButton = screen.getByRole('button', { name: /popularity/i });

      expect(categoryButton).toBeInTheDocument();
      expect(popularityButton).toBeInTheDocument();
    });

    it('should render label "Group By:"', () => {
      render(<GroupByFilter />);

      expect(screen.getByText('Group By:')).toBeInTheDocument();
    });

    it('should render with role="group"', () => {
      render(<GroupByFilter />);

      const toolbar = screen.getByRole('group');
      expect(toolbar).toBeInTheDocument();
    });
  });

  describe('Default selection', () => {
    it('should show "Category" as selected by default', () => {
      render(<GroupByFilter />);

      const categoryButton = screen.getByRole('button', { name: /category/i });
      expect(categoryButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should show "Popularity" as unselected by default', () => {
      render(<GroupByFilter />);

      const popularityButton = screen.getByRole('button', { name: /popularity/i });
      expect(popularityButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Selection toggle', () => {
    it('should call setGroupByMethod when clicking "Popularity"', async () => {
      const user = userEvent.setup();
      render(<GroupByFilter />);

      const popularityButton = screen.getByRole('button', { name: /popularity/i });
      await user.click(popularityButton);

      expect(mockSetGroupByMethod).toHaveBeenCalledWith('popularity');
      expect(mockSetGroupByMethod).toHaveBeenCalledTimes(1);
    });

    it('should call setGroupByMethod when clicking "Category" while on Popularity', async () => {
      // Mock popularity as active
      vi.spyOn(useGroupByFilterModule, 'useGroupByFilter').mockReturnValue({
        groupByMethod: 'popularity',
        setGroupByMethod: mockSetGroupByMethod,
        isCategory: false,
        isPopularity: true
      });

      const user = userEvent.setup();
      render(<GroupByFilter />);

      const categoryButton = screen.getByRole('button', { name: /category/i });
      await user.click(categoryButton);

      expect(mockSetGroupByMethod).toHaveBeenCalledWith('category');
      expect(mockSetGroupByMethod).toHaveBeenCalledTimes(1);
    });

    it('should show Popularity as selected when groupByMethod is "popularity"', () => {
      vi.spyOn(useGroupByFilterModule, 'useGroupByFilter').mockReturnValue({
        groupByMethod: 'popularity',
        setGroupByMethod: mockSetGroupByMethod,
        isCategory: false,
        isPopularity: true
      });

      render(<GroupByFilter />);

      const popularityButton = screen.getByRole('button', { name: /popularity/i });
      const categoryButton = screen.getByRole('button', { name: /category/i });

      expect(popularityButton).toHaveAttribute('aria-pressed', 'true');
      expect(categoryButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('ARIA attributes', () => {
    it('should have aria-label on group', () => {
      render(<GroupByFilter />);

      const toolbar = screen.getByRole('group');
      expect(toolbar).toHaveAttribute('aria-label', 'Group by method');
    });

    it('should have aria-pressed on Category button', () => {
      render(<GroupByFilter />);

      const categoryButton = screen.getByRole('button', { name: /category/i });
      expect(categoryButton).toHaveAttribute('aria-pressed');
    });

    it('should have aria-pressed on Popularity button', () => {
      render(<GroupByFilter />);

      const popularityButton = screen.getByRole('button', { name: /popularity/i });
      expect(popularityButton).toHaveAttribute('aria-pressed');
    });
  });

  describe('Styling consistency', () => {
    it('should have FrequencyFilter container styling', () => {
      render(<GroupByFilter />);

      const toolbar = screen.getByRole('group');
      expect(toolbar.className).toContain('flex');
      expect(toolbar.className).toContain('flex-wrap');
      expect(toolbar.className).toContain('items-center');
      expect(toolbar.className).toContain('gap-1');
      expect(toolbar.className).toContain('mb-4');
      expect(toolbar.className).toContain('p-2');
      expect(toolbar.className).toContain('bg-gray-50');
      expect(toolbar.className).toContain('dark:bg-gray-800');
      expect(toolbar.className).toContain('rounded-lg');
    });

    it('should have label styling matching FrequencyFilter', () => {
      render(<GroupByFilter />);

      const label = screen.getByText('Group By:');
      expect(label.className).toContain('text-gray-600');
      expect(label.className).toContain('dark:text-gray-400');
      expect(label.className).toContain('text-[12px]');
      expect(label.className).toContain('font-medium');
      expect(label.className).toContain('mr-2');
    });

    it('should have button sizing matching FrequencyFilter (px-[4px] py-[2px] text-[10px])', () => {
      render(<GroupByFilter />);

      const categoryButton = screen.getByRole('button', { name: /category/i });
      expect(categoryButton.className).toContain('px-[4px]');
      expect(categoryButton.className).toContain('py-[2px]');
      expect(categoryButton.className).toContain('text-[10px]');
      expect(categoryButton.className).toContain('font-medium');
      expect(categoryButton.className).toContain('rounded');
      expect(categoryButton.className).toContain('transition-all');
      expect(categoryButton.className).toContain('duration-200');
    });

    it('should have selected button styling', () => {
      render(<GroupByFilter />);

      const categoryButton = screen.getByRole('button', { name: /category/i });
      expect(categoryButton.className).toContain('bg-blue-600');
      expect(categoryButton.className).toContain('dark:bg-blue-500');
      expect(categoryButton.className).toContain('text-white');
      expect(categoryButton.className).toContain('shadow-md');
    });

    it('should have unselected button styling', () => {
      render(<GroupByFilter />);

      const popularityButton = screen.getByRole('button', { name: /popularity/i });
      expect(popularityButton.className).toContain('bg-white');
      expect(popularityButton.className).toContain('dark:bg-gray-700');
      expect(popularityButton.className).toContain('text-gray-700');
      expect(popularityButton.className).toContain('dark:text-gray-300');
      expect(popularityButton.className).toContain('border');
      expect(popularityButton.className).toContain('border-gray-300');
      expect(popularityButton.className).toContain('dark:border-gray-600');
    });
  });

  describe('Custom className prop', () => {
    it('should accept and apply custom className', () => {
      render(<GroupByFilter className="custom-class" />);

      const toolbar = screen.getByRole('group');
      expect(toolbar.className).toContain('custom-class');
    });
  });
});
