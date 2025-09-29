import { renderHook, act } from '@testing-library/react';
import { useFrequencyFilter } from '../../src/hooks/useFrequencyFilter';
import { useFilterStore } from '../../src/store/filterStore';

// Mock the store
jest.mock('../../src/store/filterStore');

describe('useFrequencyFilter Hook', () => {
  const mockSetFrequency = jest.fn();
  const mockTerms = [
    { value: 'term1', frequency: 'ubiquitous' },
    { value: 'term2', frequency: 'frequent' },
    { value: 'term3', frequency: 'frequent' },
    { value: 'term4', frequency: 'infrequent' },
    { value: 'term5', frequency: 'rare' },
    { value: 'term6' }, // No frequency
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

  describe('filterTerms function', () => {
    it('should return all term values when filter is "all"', () => {
      const { result } = renderHook(() => useFrequencyFilter());

      const filtered = result.current.filterTerms(mockTerms);

      expect(filtered).toEqual(['term1', 'term2', 'term3', 'term4', 'term5', 'term6']);
    });

    it('should filter terms correctly by frequency', () => {
      (useFilterStore as jest.MockedFunction<typeof useFilterStore>).mockReturnValue({
        selectedFrequency: 'frequent',
        setFrequency: mockSetFrequency,
        resetFilter: jest.fn(),
        isFiltered: jest.fn().mockReturnValue(true),
      });

      const { result } = renderHook(() => useFrequencyFilter());

      const filtered = result.current.filterTerms(mockTerms);

      expect(filtered).toEqual(['term2', 'term3']);
    });

    it('should return empty array when no terms match the filter', () => {
      (useFilterStore as jest.MockedFunction<typeof useFilterStore>).mockReturnValue({
        selectedFrequency: 'ubiquitous',
        setFrequency: mockSetFrequency,
        resetFilter: jest.fn(),
        isFiltered: jest.fn().mockReturnValue(true),
      });

      const termsWithNoUbiquitous = mockTerms.filter(t => t.frequency !== 'ubiquitous');
      const { result } = renderHook(() => useFrequencyFilter());

      const filtered = result.current.filterTerms(termsWithNoUbiquitous);

      expect(filtered).toEqual([]);
    });

    it('should handle terms without frequency metadata', () => {
      (useFilterStore as jest.MockedFunction<typeof useFilterStore>).mockReturnValue({
        selectedFrequency: 'rare',
        setFrequency: mockSetFrequency,
        resetFilter: jest.fn(),
        isFiltered: jest.fn().mockReturnValue(true),
      });

      const { result } = renderHook(() => useFrequencyFilter());

      const filtered = result.current.filterTerms(mockTerms);

      expect(filtered).toEqual(['term5']); // Only the rare term
      expect(filtered).not.toContain('term6'); // term6 has no frequency
    });
  });

  describe('getAvailability function', () => {
    it('should calculate counts correctly for each frequency', () => {
      const { result } = renderHook(() => useFrequencyFilter());

      const availability = result.current.getAvailability(mockTerms);

      expect(availability.get('all')).toEqual({
        available: true,
        count: 6,
        label: 'All',
      });
      expect(availability.get('ubiquitous')).toEqual({
        available: true,
        count: 1,
        label: 'Ubiquitous',
      });
      expect(availability.get('frequent')).toEqual({
        available: true,
        count: 2,
        label: 'Frequent',
      });
      expect(availability.get('infrequent')).toEqual({
        available: true,
        count: 1,
        label: 'Infrequent',
      });
      expect(availability.get('rare')).toEqual({
        available: true,
        count: 1,
        label: 'Rare',
      });
    });

    it('should mark categories as unavailable when count is 0', () => {
      const termsWithNoRare = mockTerms.filter(t => t.frequency !== 'rare');
      const { result } = renderHook(() => useFrequencyFilter());

      const availability = result.current.getAvailability(termsWithNoRare);

      expect(availability.get('rare')).toEqual({
        available: false,
        count: 0,
        label: 'No Rare Available',
      });
    });

    it('should count terms without frequency only in "all" category', () => {
      const termsOnlyUntagged = [
        { value: 'term1' },
        { value: 'term2' },
        { value: 'term3' },
      ];
      const { result } = renderHook(() => useFrequencyFilter());

      const availability = result.current.getAvailability(termsOnlyUntagged);

      expect(availability.get('all')?.count).toBe(3);
      expect(availability.get('ubiquitous')?.count).toBe(0);
      expect(availability.get('frequent')?.count).toBe(0);
      expect(availability.get('infrequent')?.count).toBe(0);
      expect(availability.get('rare')?.count).toBe(0);
    });
  });

  describe('State Management', () => {
    it('should return current selectedFrequency from store', () => {
      const { result } = renderHook(() => useFrequencyFilter());

      expect(result.current.selectedFrequency).toBe('all');
    });

    it('should call store setFrequency when setFrequency is called', () => {
      const { result } = renderHook(() => useFrequencyFilter());

      act(() => {
        result.current.setFrequency('frequent');
      });

      expect(mockSetFrequency).toHaveBeenCalledWith('frequent');
    });
  });
});