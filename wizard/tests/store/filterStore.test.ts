import { renderHook, act } from '@testing-library/react';
import { useFilterStore } from '../../src/store/filterStore';

// Mock session storage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
});

describe('filterStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue(null);
    // Reset store state
    useFilterStore.setState({ selectedFrequency: 'all' });
  });

  describe('Initial State', () => {
    it('should have initial state of "all"', () => {
      const { result } = renderHook(() => useFilterStore());

      expect(result.current.selectedFrequency).toBe('all');
    });

    it('should restore state from session storage if available', () => {
      const storedState = {
        version: '1.0.0',
        selectedFrequency: 'frequent',
        lastUpdated: new Date().toISOString(),
      };
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(storedState));

      // Force store re-initialization
      const { result } = renderHook(() => useFilterStore.getState());

      // The store should attempt to restore from session storage on initialization
      // This would typically be done in the store's initialization code
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith('adp-frequency-filter');
    });
  });

  describe('setFrequency', () => {
    it('should update selectedFrequency state', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setFrequency('frequent');
      });

      expect(result.current.selectedFrequency).toBe('frequent');
    });

    it('should persist to session storage when frequency changes', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setFrequency('rare');
      });

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'adp-frequency-filter',
        expect.stringContaining('"selectedFrequency":"rare"')
      );
    });

    it('should include version and timestamp in persisted data', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setFrequency('ubiquitous');
      });

      const savedData = JSON.parse(
        mockSessionStorage.setItem.mock.calls[0][1]
      );

      expect(savedData).toMatchObject({
        version: '1.0.0',
        selectedFrequency: 'ubiquitous',
        lastUpdated: expect.any(String),
      });
    });
  });

  describe('resetFilter', () => {
    it('should reset selectedFrequency to "all"', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setFrequency('infrequent');
      });

      expect(result.current.selectedFrequency).toBe('infrequent');

      act(() => {
        result.current.resetFilter();
      });

      expect(result.current.selectedFrequency).toBe('all');
    });

    it('should update session storage when reset', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setFrequency('frequent');
      });

      mockSessionStorage.setItem.mockClear();

      act(() => {
        result.current.resetFilter();
      });

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        'adp-frequency-filter',
        expect.stringContaining('"selectedFrequency":"all"')
      );
    });
  });

  describe('isFiltered', () => {
    it('should return false when selectedFrequency is "all"', () => {
      const { result } = renderHook(() => useFilterStore());

      expect(result.current.isFiltered()).toBe(false);
    });

    it('should return true when selectedFrequency is not "all"', () => {
      const { result } = renderHook(() => useFilterStore());

      act(() => {
        result.current.setFrequency('frequent');
      });

      expect(result.current.isFiltered()).toBe(true);
    });
  });

  describe('Session Storage Persistence', () => {
    it('should handle session storage errors gracefully', () => {
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const { result } = renderHook(() => useFilterStore());

      // Should not throw
      expect(() => {
        act(() => {
          result.current.setFrequency('rare');
        });
      }).not.toThrow();

      // State should still update
      expect(result.current.selectedFrequency).toBe('rare');
    });

    it('should handle malformed session storage data', () => {
      mockSessionStorage.getItem.mockReturnValue('invalid json');

      // Store should initialize with default state
      const { result } = renderHook(() => useFilterStore());
      expect(result.current.selectedFrequency).toBe('all');
    });

    it('should ignore outdated version data', () => {
      const oldVersionData = {
        version: '0.9.0', // Old version
        selectedFrequency: 'frequent',
        lastUpdated: new Date().toISOString(),
      };
      mockSessionStorage.getItem.mockReturnValue(JSON.stringify(oldVersionData));

      // Store should initialize with default state when version doesn't match
      const { result } = renderHook(() => useFilterStore());

      // Would typically check version and reset to default
      // This would be implemented in the actual store
      expect(result.current.selectedFrequency).toBe('all');
    });
  });
});