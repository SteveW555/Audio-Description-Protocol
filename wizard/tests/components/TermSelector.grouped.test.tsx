/**
 * Tests for TermSelector component with grouping support
 * Feature: 006-below-the-filter
 * Task: T009
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TermSelector } from '../../src/components/TermSelector';

describe('TermSelector with grouping', () => {
  const mockOnSelect = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnSkip = vi.fn();

  const mockTerms = [
    'joyful',     // Mood + ubiquitous
    'peaceful',   // Mood + ubiquitous
    'happy',      // Mood + frequent
    'high-energy',// Energy + ubiquitous
    'driving',    // Energy + frequent
    'bright',     // Texture + frequent
    'warm'        // Texture + frequent
  ];

  beforeEach(() => {
    mockOnSelect.mockClear();
    mockOnNext.mockClear();
    mockOnSkip.mockClear();
  });

  describe('Backward compatibility', () => {
    it('should render flat layout when groupByMethod is undefined', () => {
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
        />
      );

      // Should render all terms without group labels
      expect(screen.getByText(/joyful/i)).toBeInTheDocument();
      expect(screen.getByText(/high-energy/i)).toBeInTheDocument();
      expect(screen.getByText(/bright/i)).toBeInTheDocument();

      // Should NOT have group labels
      expect(screen.queryByText('Mood')).not.toBeInTheDocument();
      expect(screen.queryByText('Energy')).not.toBeInTheDocument();
      expect(screen.queryByText('Texture')).not.toBeInTheDocument();
    });
  });

  describe('Category grouping', () => {
    it('should render grouped layout when groupByMethod="category"', () => {
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      // Should have group labels
      expect(screen.getByText('Mood')).toBeInTheDocument();
      expect(screen.getByText('Energy')).toBeInTheDocument();
      expect(screen.getByText('Texture')).toBeInTheDocument();
    });

    it('should render 3 groups with correct labels: Mood, Energy, Texture', () => {
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      const labels = screen.getAllByTestId('group-label');
      expect(labels).toHaveLength(3);
      expect(labels[0]).toHaveTextContent('Mood');
      expect(labels[1]).toHaveTextContent('Energy');
      expect(labels[2]).toHaveTextContent('Texture');
    });

    it('should group mood terms together', () => {
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      const moodLabel = screen.getByText('Mood');
      const moodGroup = moodLabel.closest('[data-testid="term-group"]');

      expect(moodGroup).toBeInTheDocument();
      expect(within(moodGroup!).getByText(/joyful/i)).toBeInTheDocument();
      expect(within(moodGroup!).getByText(/peaceful/i)).toBeInTheDocument();
      expect(within(moodGroup!).getByText(/happy/i)).toBeInTheDocument();
    });

    it('should group energy terms together', () => {
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      const energyLabel = screen.getByText('Energy');
      const energyGroup = energyLabel.closest('[data-testid="term-group"]');

      expect(energyGroup).toBeInTheDocument();
      expect(within(energyGroup!).getByText(/high energy/i)).toBeInTheDocument();
      expect(within(energyGroup!).getByText(/driving/i)).toBeInTheDocument();
    });

    it('should group texture terms together', () => {
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      const textureLabel = screen.getByText('Texture');
      const textureGroup = textureLabel.closest('[data-testid="term-group"]');

      expect(textureGroup).toBeInTheDocument();
      expect(within(textureGroup!).getByText(/bright/i)).toBeInTheDocument();
      expect(within(textureGroup!).getByText(/warm/i)).toBeInTheDocument();
    });
  });

  describe('Popularity grouping', () => {
    it('should render grouped layout when groupByMethod="popularity"', () => {
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="popularity"
        />
      );

      // Should have at least one popularity group label
      const labels = screen.queryAllByTestId('group-label');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should render groups in order: Ubiquitous, Frequent, Infrequent, Rare', () => {
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="popularity"
        />
      );

      const labels = screen.getAllByTestId('group-label');
      
      // Our mockTerms have ubiquitous and frequent only
      expect(labels[0]).toHaveTextContent('Ubiquitous');
      expect(labels[1]).toHaveTextContent('Frequent');
    });

    it('should group ubiquitous terms together', () => {
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="popularity"
        />
      );

      const ubiquitousLabel = screen.getByText('Ubiquitous');
      const ubiquitousGroup = ubiquitousLabel.closest('[data-testid="term-group"]');

      expect(ubiquitousGroup).toBeInTheDocument();
      expect(within(ubiquitousGroup!).getByText(/joyful/i)).toBeInTheDocument();
      expect(within(ubiquitousGroup!).getByText(/peaceful/i)).toBeInTheDocument();
      expect(within(ubiquitousGroup!).getByText(/high energy/i)).toBeInTheDocument();
    });
  });

  describe('Group separators', () => {
    it('should display separators between groups', () => {
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      const separators = screen.getAllByTestId('group-separator');
      // 3 groups = 2 separators (none before first group)
      expect(separators).toHaveLength(2);
    });

    it('should have border-t styling on separators', () => {
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      const separators = screen.getAllByTestId('group-separator');
      const separator = separators[0];

      expect(separator.className).toContain('border-t');
      expect(separator.className).toContain('border-gray-300');
      expect(separator.className).toContain('dark:border-gray-600');
      expect(separator.className).toContain('pt-2');
      expect(separator.className).toContain('mt-2');
    });
  });

  describe('Group labels styling', () => {
    it('should have text-[10px] styling on group labels', () => {
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      const labels = screen.getAllByTestId('group-label');
      labels.forEach(label => {
        expect(label.className).toContain('text-[10px]');
        expect(label.className).toContain('text-gray-500');
        expect(label.className).toContain('dark:text-gray-400');
        expect(label.className).toContain('font-medium');
        expect(label.className).toContain('mb-1');
      });
    });
  });

  describe('Term interaction within groups', () => {
    it('should allow clicking terms within groups', async () => {
      const user = userEvent.setup();
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      const joyfulButton = screen.getByText(/joyful/i);
      await user.click(joyfulButton);

      expect(mockOnSelect).toHaveBeenCalled();
    });

    it('should maintain term selection styling within groups', async () => {
      const user = userEvent.setup();
      render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          selected={['joyful']}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      const joyfulButton = screen.getByText(/joyful/i);
      expect(joyfulButton.className).toContain('bg-blue-600');
    });
  });

  describe('Term selection state preservation', () => {
    it('should preserve selection when switching from category to popularity', () => {
      const { rerender } = render(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          selected={['joyful', 'high-energy']}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      // Verify selections in category view
      expect(screen.getByText(/joyful/i).className).toContain('bg-blue-600');
      expect(screen.getByText(/high energy/i).className).toContain('bg-blue-600');

      // Switch to popularity grouping
      rerender(
        <TermSelector
          terms={mockTerms}
          onSelect={mockOnSelect}
          selected={['joyful', 'high-energy']}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="popularity"
        />
      );

      // Selections should still be active
      expect(screen.getByText(/joyful/i).className).toContain('bg-blue-600');
      expect(screen.getByText(/high energy/i).className).toContain('bg-blue-600');
    });
  });

  describe('Terms without metadata', () => {
    it('should render ungrouped terms at the end without a label', () => {
      const termsWithUnknown = [...mockTerms, 'unknown-term'];
      render(
        <TermSelector
          terms={termsWithUnknown}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      // Unknown term should be rendered
      expect(screen.getByText(/unknown term/i)).toBeInTheDocument();

      // Should be outside of any labeled group
      // (Implementation detail: it appears after all groups)
      const groups = screen.getAllByTestId('term-group');
      const lastGroup = groups[groups.length - 1];
      
      // The ungrouped section should not have a group label
      expect(within(lastGroup).queryByTestId('group-label')).toBeNull();
    });
  });

  describe('Empty groups filtering', () => {
    it('should not render empty groups', () => {
      const onlyMoodTerms = ['joyful', 'peaceful', 'happy'];
      render(
        <TermSelector
          terms={onlyMoodTerms}
          onSelect={mockOnSelect}
          onNext={mockOnNext}
          onSkip={mockOnSkip}
          multi={true}
          groupByMethod="category"
        />
      );

      // Should only have Mood group
      expect(screen.getByText('Mood')).toBeInTheDocument();
      expect(screen.queryByText('Energy')).not.toBeInTheDocument();
      expect(screen.queryByText('Texture')).not.toBeInTheDocument();
    });
  });
});
