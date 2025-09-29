import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FrequencyFilter } from '../../src/components/FrequencyFilter';
import { TermSelector } from '../../src/components/TermSelector';
import { useFrequencyFilter } from '../../src/hooks/useFrequencyFilter';

// Mock component that simulates step navigation
const WizardWithFilter: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const { filterTerms } = useFrequencyFilter();

  const stepTerms = {
    1: [
      { value: 'step1-ubiquitous', frequency: 'ubiquitous' },
      { value: 'step1-frequent', frequency: 'frequent' },
      { value: 'step1-rare', frequency: 'rare' },
    ],
    2: [
      { value: 'step2-ubiquitous', frequency: 'ubiquitous' },
      { value: 'step2-frequent', frequency: 'frequent' },
      { value: 'step2-infrequent', frequency: 'infrequent' },
    ],
    3: [
      { value: 'step3-frequent', frequency: 'frequent' },
      { value: 'step3-rare', frequency: 'rare' },
    ],
  };

  const currentTerms = stepTerms[currentStep as keyof typeof stepTerms];
  const filteredTermValues = filterTerms(currentTerms);

  return (
    <div>
      <h2>Step {currentStep}</h2>
      <FrequencyFilter terms={currentTerms} />
      <TermSelector
        terms={filteredTermValues}
        selectedTerms={[]}
        onTermSelect={() => {}}
        multiSelect={false}
      />
      <div>
        <button onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}>
          Previous Step
        </button>
        <button onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}>
          Next Step
        </button>
      </div>
    </div>
  );
};

describe('Filter Persistence Integration', () => {
  beforeEach(() => {
    // Clear session storage
    sessionStorage.clear();
  });

  it('should persist filter across step navigation', async () => {
    render(<WizardWithFilter />);

    // Start on step 1
    expect(screen.getByText('Step 1')).toBeInTheDocument();

    // Select "frequent" filter
    const frequentButton = screen.getByText('Frequent');
    fireEvent.click(frequentButton);

    // Verify only frequent term is visible
    expect(screen.getByText('step1-frequent')).toBeInTheDocument();
    expect(screen.queryByText('step1-ubiquitous')).not.toBeInTheDocument();
    expect(screen.queryByText('step1-rare')).not.toBeInTheDocument();

    // Navigate to step 2
    fireEvent.click(screen.getByText('Next Step'));

    await waitFor(() => {
      expect(screen.getByText('Step 2')).toBeInTheDocument();
    });

    // Filter should still be set to "frequent"
    expect(screen.getByText('step2-frequent')).toBeInTheDocument();
    expect(screen.queryByText('step2-ubiquitous')).not.toBeInTheDocument();
    expect(screen.queryByText('step2-infrequent')).not.toBeInTheDocument();

    // Navigate to step 3
    fireEvent.click(screen.getByText('Next Step'));

    await waitFor(() => {
      expect(screen.getByText('Step 3')).toBeInTheDocument();
    });

    // Filter should still be active
    expect(screen.getByText('step3-frequent')).toBeInTheDocument();
    expect(screen.queryByText('step3-rare')).not.toBeInTheDocument();
  });

  it('should maintain filter when navigating backward', async () => {
    render(<WizardWithFilter />);

    // Navigate to step 2
    fireEvent.click(screen.getByText('Next Step'));
    await waitFor(() => {
      expect(screen.getByText('Step 2')).toBeInTheDocument();
    });

    // Select "ubiquitous" filter
    const ubiquitousButton = screen.getByText('Ubiquitous');
    fireEvent.click(ubiquitousButton);

    // Verify filter is applied
    expect(screen.getByText('step2-ubiquitous')).toBeInTheDocument();
    expect(screen.queryByText('step2-frequent')).not.toBeInTheDocument();

    // Navigate back to step 1
    fireEvent.click(screen.getByText('Previous Step'));

    await waitFor(() => {
      expect(screen.getByText('Step 1')).toBeInTheDocument();
    });

    // Filter should still be "ubiquitous"
    expect(screen.getByText('step1-ubiquitous')).toBeInTheDocument();
    expect(screen.queryByText('step1-frequent')).not.toBeInTheDocument();
    expect(screen.queryByText('step1-rare')).not.toBeInTheDocument();
  });

  it('should handle filter changes mid-navigation', async () => {
    render(<WizardWithFilter />);

    // Select "rare" filter on step 1
    fireEvent.click(screen.getByText('Rare'));
    expect(screen.getByText('step1-rare')).toBeInTheDocument();

    // Navigate to step 2
    fireEvent.click(screen.getByText('Next Step'));
    await waitFor(() => {
      expect(screen.getByText('Step 2')).toBeInTheDocument();
    });

    // Step 2 has no rare terms, so no terms should be visible
    expect(screen.queryByText('step2-ubiquitous')).not.toBeInTheDocument();
    expect(screen.queryByText('step2-frequent')).not.toBeInTheDocument();
    expect(screen.queryByText('step2-infrequent')).not.toBeInTheDocument();

    // Change filter to "all"
    fireEvent.click(screen.getByText('All'));

    // All terms should now be visible
    expect(screen.getByText('step2-ubiquitous')).toBeInTheDocument();
    expect(screen.getByText('step2-frequent')).toBeInTheDocument();
    expect(screen.getByText('step2-infrequent')).toBeInTheDocument();

    // Navigate to step 3
    fireEvent.click(screen.getByText('Next Step'));
    await waitFor(() => {
      expect(screen.getByText('Step 3')).toBeInTheDocument();
    });

    // All terms should be visible (filter is "all")
    expect(screen.getByText('step3-frequent')).toBeInTheDocument();
    expect(screen.getByText('step3-rare')).toBeInTheDocument();
  });
});