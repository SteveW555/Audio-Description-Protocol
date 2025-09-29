import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FrequencyFilter } from '../../src/components/FrequencyFilter';
import { useFilterStore } from '../../src/store/filterStore';

// Mock the store
jest.mock('../../src/store/filterStore');

describe('FrequencyFilter Component', () => {
  const mockSetFrequency = jest.fn();
  const mockTerms = [
    { value: 'term1', frequency: 'ubiquitous' },
    { value: 'term2', frequency: 'frequent' },
    { value: 'term3', frequency: 'infrequent' },
    { value: 'term4', frequency: 'rare' },
    { value: 'term5' }, // No frequency
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useFilterStore as jest.MockedFunction<typeof useFilterStore>).mockReturnValue({
      selectedFrequency: 'all',
      setFrequency: mockSetFrequency,
      resetFilter: jest.fn(),
      isFiltered: jest.fn().mockReturnValue(false),
    });
  });

  describe('Rendering', () => {
    it('should render filter toolbar with 5 options', () => {
      render(<FrequencyFilter terms={mockTerms} />);

      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Ubiquitous')).toBeInTheDocument();
      expect(screen.getByText('Frequent')).toBeInTheDocument();
      expect(screen.getByText('Infrequent')).toBeInTheDocument();
      expect(screen.getByText('Rare')).toBeInTheDocument();
    });

    it('should highlight the selected frequency option', () => {
      (useFilterStore as jest.MockedFunction<typeof useFilterStore>).mockReturnValue({
        selectedFrequency: 'frequent',
        setFrequency: mockSetFrequency,
        resetFilter: jest.fn(),
        isFiltered: jest.fn().mockReturnValue(true),
      });

      render(<FrequencyFilter terms={mockTerms} />);

      const frequentButton = screen.getByText('Frequent').closest('button');
      expect(frequentButton).toHaveClass('bg-blue-600');
    });
  });

  describe('Disabled States', () => {
    it('should show disabled state with "No [frequency] Available" labels', () => {
      const termsWithNoRare = mockTerms.filter(t => t.frequency !== 'rare');
      render(<FrequencyFilter terms={termsWithNoRare} />);

      const rareButton = screen.getByText('No Rare Available').closest('button');
      expect(rareButton).toBeDisabled();
    });

    it('should disable buttons for categories with no terms', () => {
      const termsOnlyFrequent = [
        { value: 'term1', frequency: 'frequent' },
        { value: 'term2', frequency: 'frequent' },
      ];

      render(<FrequencyFilter terms={termsOnlyFrequent} />);

      expect(screen.getByText('No Ubiquitous Available').closest('button')).toBeDisabled();
      expect(screen.getByText('No Infrequent Available').closest('button')).toBeDisabled();
      expect(screen.getByText('No Rare Available').closest('button')).toBeDisabled();
    });
  });

  describe('Dark Mode Support', () => {
    it('should apply dark mode styling when dark class is present', () => {
      document.documentElement.classList.add('dark');

      render(<FrequencyFilter terms={mockTerms} />);

      const filterContainer = screen.getByRole('group', { name: /frequency filter/i });
      expect(filterContainer).toHaveClass('dark:bg-gray-800');

      document.documentElement.classList.remove('dark');
    });

    it('should style disabled buttons appropriately in dark mode', () => {
      document.documentElement.classList.add('dark');
      const termsWithNoRare = mockTerms.filter(t => t.frequency !== 'rare');

      render(<FrequencyFilter terms={termsWithNoRare} />);

      const rareButton = screen.getByText('No Rare Available').closest('button');
      expect(rareButton).toHaveClass('dark:bg-gray-700');
      expect(rareButton).toHaveClass('dark:text-gray-500');

      document.documentElement.classList.remove('dark');
    });
  });

  describe('User Interactions', () => {
    it('should call setFrequency when a filter option is clicked', () => {
      render(<FrequencyFilter terms={mockTerms} />);

      const frequentButton = screen.getByText('Frequent');
      fireEvent.click(frequentButton);

      expect(mockSetFrequency).toHaveBeenCalledWith('frequent');
    });

    it('should not call setFrequency when a disabled option is clicked', () => {
      const termsWithNoRare = mockTerms.filter(t => t.frequency !== 'rare');
      render(<FrequencyFilter terms={termsWithNoRare} />);

      const rareButton = screen.getByText('No Rare Available').closest('button');
      fireEvent.click(rareButton!);

      expect(mockSetFrequency).not.toHaveBeenCalled();
    });
  });
});