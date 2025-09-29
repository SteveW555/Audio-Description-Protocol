import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FrequencyFilter } from '../../src/components/FrequencyFilter';
import { TermSelector } from '../../src/components/TermSelector';
import { useFrequencyFilter } from '../../src/hooks/useFrequencyFilter';

const MultiSelectWithFilter: React.FC = () => {
  const [selectedTerms, setSelectedTerms] = React.useState<string[]>([]);
  const { filterTerms } = useFrequencyFilter();

  const terms = [
    { value: 'Rock', frequency: 'ubiquitous' },
    { value: 'Pop', frequency: 'ubiquitous' },
    { value: 'Jazz', frequency: 'frequent' },
    { value: 'Blues', frequency: 'frequent' },
    { value: 'Classical', frequency: 'frequent' },
    { value: 'Country', frequency: 'infrequent' },
    { value: 'Reggae', frequency: 'infrequent' },
    { value: 'Ska', frequency: 'rare' },
    { value: 'Polka', frequency: 'rare' },
    { value: 'Electronic' }, // No frequency
  ];

  const filteredTermValues = filterTerms(terms);

  const handleTermSelect = (term: string) => {
    setSelectedTerms(prev => {
      if (prev.includes(term)) {
        return prev.filter(t => t !== term);
      } else {
        return [...prev, term];
      }
    });
  };

  return (
    <div>
      <h2>Select Music Genres (Multiple)</h2>
      <FrequencyFilter terms={terms} />
      <div data-testid="selection-count">
        Selected: {selectedTerms.length} genres
      </div>
      <div data-testid="selected-list">
        {selectedTerms.join(', ') || 'None'}
      </div>
      <TermSelector
        terms={filteredTermValues}
        selectedTerms={selectedTerms}
        onTermSelect={handleTermSelect}
        multiSelect={true}
      />
    </div>
  );
};

describe('Multi-Select with Filter Integration', () => {
  it('should maintain selections when filter changes', () => {
    render(<MultiSelectWithFilter />);

    // Select some frequent terms
    fireEvent.click(screen.getByText('Jazz'));
    fireEvent.click(screen.getByText('Blues'));

    expect(screen.getByTestId('selected-list')).toHaveTextContent('Jazz, Blues');
    expect(screen.getByTestId('selection-count')).toHaveTextContent('Selected: 2 genres');

    // Apply filter to show only ubiquitous
    fireEvent.click(screen.getByText('Ubiquitous'));

    // Selected items should remain selected (even if not visible)
    expect(screen.getByTestId('selected-list')).toHaveTextContent('Jazz, Blues');
    expect(screen.getByTestId('selection-count')).toHaveTextContent('Selected: 2 genres');

    // Jazz and Blues shouldn't be visible
    expect(screen.queryByRole('button', { name: 'Jazz' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Blues' })).not.toBeInTheDocument();

    // Switch back to all
    fireEvent.click(screen.getByText('All'));

    // Selected items should still be selected and now visible
    expect(screen.getByTestId('selected-list')).toHaveTextContent('Jazz, Blues');
    const jazzButton = screen.getByText('Jazz').closest('button');
    const bluesButton = screen.getByText('Blues').closest('button');
    expect(jazzButton).toHaveAttribute('aria-pressed', 'true');
    expect(bluesButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should allow selecting from filtered results', () => {
    render(<MultiSelectWithFilter />);

    // Apply frequent filter
    fireEvent.click(screen.getByText('Frequent'));

    // Select all frequent items
    fireEvent.click(screen.getByText('Jazz'));
    fireEvent.click(screen.getByText('Blues'));
    fireEvent.click(screen.getByText('Classical'));

    expect(screen.getByTestId('selected-list')).toHaveTextContent('Jazz, Blues, Classical');

    // Switch to rare filter
    fireEvent.click(screen.getByText('Rare'));

    // Previous selections should persist
    expect(screen.getByTestId('selection-count')).toHaveTextContent('Selected: 3 genres');

    // Select rare items
    fireEvent.click(screen.getByText('Ska'));
    fireEvent.click(screen.getByText('Polka'));

    expect(screen.getByTestId('selected-list')).toHaveTextContent('Jazz, Blues, Classical, Ska, Polka');
    expect(screen.getByTestId('selection-count')).toHaveTextContent('Selected: 5 genres');
  });

  it('should handle deselection with active filter', () => {
    render(<MultiSelectWithFilter />);

    // Select items from different frequencies
    fireEvent.click(screen.getByText('Rock')); // ubiquitous
    fireEvent.click(screen.getByText('Jazz')); // frequent
    fireEvent.click(screen.getByText('Country')); // infrequent
    fireEvent.click(screen.getByText('Ska')); // rare

    expect(screen.getByTestId('selection-count')).toHaveTextContent('Selected: 4 genres');

    // Filter to frequent
    fireEvent.click(screen.getByText('Frequent'));

    // Only Jazz should be visible and selected
    const jazzButton = screen.getByText('Jazz').closest('button');
    expect(jazzButton).toHaveAttribute('aria-pressed', 'true');

    // Deselect Jazz
    fireEvent.click(screen.getByText('Jazz'));

    expect(screen.getByTestId('selected-list')).toHaveTextContent('Rock, Country, Ska');
    expect(screen.getByTestId('selection-count')).toHaveTextContent('Selected: 3 genres');

    // Switch back to all - Jazz should no longer be selected
    fireEvent.click(screen.getByText('All'));
    const jazzButtonAfter = screen.getByText('Jazz').closest('button');
    expect(jazzButtonAfter).toHaveAttribute('aria-pressed', 'false');
  });

  it('should work correctly with rapid filter changes during selection', () => {
    render(<MultiSelectWithFilter />);

    // Rapidly switch filters while selecting
    fireEvent.click(screen.getByText('Frequent'));
    fireEvent.click(screen.getByText('Jazz'));

    fireEvent.click(screen.getByText('Ubiquitous'));
    fireEvent.click(screen.getByText('Rock'));

    fireEvent.click(screen.getByText('Rare'));
    fireEvent.click(screen.getByText('Ska'));

    fireEvent.click(screen.getByText('Infrequent'));
    fireEvent.click(screen.getByText('Country'));

    fireEvent.click(screen.getByText('All'));

    // All selections should be maintained
    expect(screen.getByTestId('selected-list')).toHaveTextContent('Jazz, Rock, Ska, Country');
    expect(screen.getByTestId('selection-count')).toHaveTextContent('Selected: 4 genres');

    // Verify all selected buttons have correct state
    const selectedButtons = ['Jazz', 'Rock', 'Ska', 'Country'];
    selectedButtons.forEach(genre => {
      const button = screen.getByText(genre).closest('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });
});