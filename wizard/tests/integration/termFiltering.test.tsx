import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FrequencyFilter } from '../../src/components/FrequencyFilter';
import { TermSelector } from '../../src/components/TermSelector';
import { useFrequencyFilter } from '../../src/hooks/useFrequencyFilter';

const FilteredTermSelector: React.FC = () => {
  const { filterTerms } = useFrequencyFilter();

  const terms = [
    { value: 'Piano', frequency: 'ubiquitous' },
    { value: 'Guitar', frequency: 'ubiquitous' },
    { value: 'Drums', frequency: 'frequent' },
    { value: 'Bass', frequency: 'frequent' },
    { value: 'Violin', frequency: 'frequent' },
    { value: 'Cello', frequency: 'infrequent' },
    { value: 'Harp', frequency: 'infrequent' },
    { value: 'Oboe', frequency: 'rare' },
    { value: 'Theremin', frequency: 'rare' },
    { value: 'Synthesizer' }, // No frequency
  ];

  const filteredTermValues = filterTerms(terms);

  return (
    <div>
      <h2>Select Instruments</h2>
      <FrequencyFilter terms={terms} />
      <div data-testid="term-count">
        Showing {filteredTermValues.length} of {terms.length} terms
      </div>
      <TermSelector
        terms={filteredTermValues}
        selectedTerms={[]}
        onTermSelect={() => {}}
        multiSelect={false}
      />
    </div>
  );
};

describe('Term Filtering Integration', () => {
  it('should only display filtered terms', () => {
    render(<FilteredTermSelector />);

    // Initially all terms should be visible
    expect(screen.getByText('Showing 10 of 10 terms')).toBeInTheDocument();
    expect(screen.getByText('Piano')).toBeInTheDocument();
    expect(screen.getByText('Drums')).toBeInTheDocument();
    expect(screen.getByText('Cello')).toBeInTheDocument();
    expect(screen.getByText('Oboe')).toBeInTheDocument();
    expect(screen.getByText('Synthesizer')).toBeInTheDocument();

    // Filter to ubiquitous only
    fireEvent.click(screen.getByText('Ubiquitous'));
    expect(screen.getByText('Showing 2 of 10 terms')).toBeInTheDocument();
    expect(screen.getByText('Piano')).toBeInTheDocument();
    expect(screen.getByText('Guitar')).toBeInTheDocument();
    expect(screen.queryByText('Drums')).not.toBeInTheDocument();
    expect(screen.queryByText('Oboe')).not.toBeInTheDocument();

    // Filter to frequent
    fireEvent.click(screen.getByText('Frequent'));
    expect(screen.getByText('Showing 3 of 10 terms')).toBeInTheDocument();
    expect(screen.getByText('Drums')).toBeInTheDocument();
    expect(screen.getByText('Bass')).toBeInTheDocument();
    expect(screen.getByText('Violin')).toBeInTheDocument();
    expect(screen.queryByText('Piano')).not.toBeInTheDocument();

    // Filter to infrequent
    fireEvent.click(screen.getByText('Infrequent'));
    expect(screen.getByText('Showing 2 of 10 terms')).toBeInTheDocument();
    expect(screen.getByText('Cello')).toBeInTheDocument();
    expect(screen.getByText('Harp')).toBeInTheDocument();

    // Filter to rare
    fireEvent.click(screen.getByText('Rare'));
    expect(screen.getByText('Showing 2 of 10 terms')).toBeInTheDocument();
    expect(screen.getByText('Oboe')).toBeInTheDocument();
    expect(screen.getByText('Theremin')).toBeInTheDocument();

    // Back to all
    fireEvent.click(screen.getByText('All'));
    expect(screen.getByText('Showing 10 of 10 terms')).toBeInTheDocument();
  });

  it('should handle terms without frequency metadata', () => {
    render(<FilteredTermSelector />);

    // Synthesizer has no frequency, should only appear in "All"
    expect(screen.getByText('Synthesizer')).toBeInTheDocument();

    // Select any specific frequency filter
    fireEvent.click(screen.getByText('Frequent'));
    expect(screen.queryByText('Synthesizer')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Rare'));
    expect(screen.queryByText('Synthesizer')).not.toBeInTheDocument();

    // Back to all - should reappear
    fireEvent.click(screen.getByText('All'));
    expect(screen.getByText('Synthesizer')).toBeInTheDocument();
  });

  it('should update term count dynamically', () => {
    render(<FilteredTermSelector />);

    const testCases = [
      { filter: 'All', expected: '10' },
      { filter: 'Ubiquitous', expected: '2' },
      { filter: 'Frequent', expected: '3' },
      { filter: 'Infrequent', expected: '2' },
      { filter: 'Rare', expected: '2' },
    ];

    testCases.forEach(({ filter, expected }) => {
      fireEvent.click(screen.getByText(filter));
      expect(screen.getByText(`Showing ${expected} of 10 terms`)).toBeInTheDocument();
    });
  });

  it('should handle rapid filter switching', () => {
    render(<FilteredTermSelector />);

    // Rapidly switch between filters
    const filters = ['Frequent', 'Rare', 'Ubiquitous', 'Infrequent', 'All'];

    filters.forEach(filter => {
      fireEvent.click(screen.getByText(filter));
    });

    // Should end up showing all terms
    expect(screen.getByText('Showing 10 of 10 terms')).toBeInTheDocument();
    expect(screen.getByText('Piano')).toBeInTheDocument();
    expect(screen.getByText('Theremin')).toBeInTheDocument();
  });
});