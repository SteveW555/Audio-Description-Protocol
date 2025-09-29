/**
 * Integration tests for Group By workflow
 * Feature: 006-below-the-filter
 * Task: T012
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TermSelector } from '../../src/components/TermSelector';
import { GroupByFilter } from '../../src/components/GroupByFilter';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Group By Integration Workflow', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  const mockTerms = [
    'joyful', 'peaceful', 'happy',        // Mood
    'high-energy', 'driving', 'laid-back', // Energy
    'bright', 'warm', 'dark'              // Texture
  ];

  describe('Full workflow: Category grouping', () => {
    it('should display terms grouped by category when Category is selected', async () => {
      const user = userEvent.setup();
      const mockOnSelect = vi.fn();
      const mockOnNext = vi.fn();
      const mockOnSkip = vi.fn();

      render(
        <div>
          <GroupByFilter />
          <TermSelector
            terms={mockTerms}
            onSelect={mockOnSelect}
            onNext={mockOnNext}
            onSkip={mockOnSkip}
            multi={true}
            groupByMethod="category"
          />
        </div>
      );

      // Verify Category button is selected
      const categoryButton = screen.getByRole('button', { name: /category/i });
      expect(categoryButton).toHaveAttribute('aria-pressed', 'true');

      // Verify terms are grouped
      expect(screen.getByText('Mood')).toBeInTheDocument();
      expect(screen.getByText('Energy')).toBeInTheDocument();
      expect(screen.getByText('Texture')).toBeInTheDocument();

      // Verify terms appear in correct groups
      const moodGroup = screen.getByText('Mood').closest('[data-testid="term-group"]');
      expect(within(moodGroup!).getByText(/joyful/i)).toBeInTheDocument();
    });
  });

  describe('Workflow: Switch to Popularity grouping', () => {
    it('should reorganize terms when switching from Category to Popularity', async () => {
      const user = userEvent.setup();
      const mockOnSelect = vi.fn();
      const mockOnNext = vi.fn();
      const mockOnSkip = vi.fn();

      const { rerender } = render(
        <div>
          <GroupByFilter />
          <TermSelector
            terms={mockTerms}
            onSelect={mockOnSelect}
            onNext={mockOnNext}
            onSkip={mockOnSkip}
            multi={true}
            groupByMethod="category"
          />
        </div>
      );

      // Initial: Category grouping
      expect(screen.getByText('Mood')).toBeInTheDocument();

      // Click Popularity button
      const popularityButton = screen.getByRole('button', { name: /popularity/i });
      await user.click(popularityButton);

      // Re-render with new grouping
      rerender(
        <div>
          <GroupByFilter />
          <TermSelector
            terms={mockTerms}
            onSelect={mockOnSelect}
            onNext={mockOnNext}
            onSkip={mockOnSkip}
            multi={true}
            groupByMethod="popularity"
          />
        </div>
      );

      // Verify terms reorganized by popularity
      expect(screen.queryByText('Mood')).not.toBeInTheDocument();
      expect(screen.getByText('Ubiquitous')).toBeInTheDocument();
      expect(screen.getByText('Frequent')).toBeInTheDocument();
    });
  });

  describe('Selection persistence across grouping changes', () => {
    it('should preserve term selections when switching grouping methods', async () => {
      const user = userEvent.setup();
      let selectedTerms: string[] = [];
      const mockOnSelect = vi.fn((terms) => {
        selectedTerms = terms as string[];
      });
      const mockOnNext = vi.fn();
      const mockOnSkip = vi.fn();

      const { rerender } = render(
        <div>
          <GroupByFilter />
          <TermSelector
            terms={mockTerms}
            selected={selectedTerms}
            onSelect={mockOnSelect}
            onNext={mockOnNext}
            onSkip={mockOnSkip}
            multi={true}
            groupByMethod="category"
          />
        </div>
      );

      // Select a term
      const joyfulButton = screen.getByText(/joyful/i);
      await user.click(joyfulButton);

      // Update selections
      selectedTerms = ['joyful'];

      // Rerender with selections
      rerender(
        <div>
          <GroupByFilter />
          <TermSelector
            terms={mockTerms}
            selected={selectedTerms}
            onSelect={mockOnSelect}
            onNext={mockOnNext}
            onSkip={mockOnSkip}
            multi={true}
            groupByMethod="category"
          />
        </div>
      );

      // Switch to popularity grouping
      rerender(
        <div>
          <GroupByFilter />
          <TermSelector
            terms={mockTerms}
            selected={selectedTerms}
            onSelect={mockOnSelect}
            onNext={mockOnNext}
            onSkip={mockOnSkip}
            multi={true}
            groupByMethod="popularity"
          />
        </div>
      );

      // Verify selection is still active
      const joyfulAfter = screen.getByText(/joyful/i);
      expect(joyfulAfter.className).toContain('bg-blue-600');
    });
  });

  describe('localStorage persistence', () => {
    it('should persist grouping preference across page reload', () => {
      const mockOnSelect = vi.fn();
      const mockOnNext = vi.fn();
      const mockOnSkip = vi.fn();

      // First render with GroupByFilter
      const { unmount } = render(
        <div>
          <GroupByFilter />
          <TermSelector
            terms={mockTerms}
            onSelect={mockOnSelect}
            onNext={mockOnNext}
            onSkip={mockOnSkip}
            multi={true}
            groupByMethod="category"
          />
        </div>
      );

      // Manually set localStorage (simulating user interaction)
      localStorage.setItem(
        'adp-wizard-groupBy-v1',
        JSON.stringify({ method: 'popularity', version: 1 })
      );

      unmount();

      // Re-render (simulating page reload)
      render(
        <div>
          <GroupByFilter />
          <TermSelector
            terms={mockTerms}
            onSelect={mockOnSelect}
            onNext={mockOnNext}
            onSkip={mockOnSkip}
            multi={true}
            groupByMethod="popularity"
          />
        </div>
      );

      // Verify preference restored
      const popularityButton = screen.getByRole('button', { name: /popularity/i });
      expect(popularityButton).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
