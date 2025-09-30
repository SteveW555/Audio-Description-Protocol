import React from 'react';
import { useWizardStore } from '../context/WizardContext';

/**
 * Displays AI-generated natural language phrase
 * Read-only, 7px font (text-[0.4375rem]), max 2-line wrap
 */
export const NLPhraseDisplay: React.FC = () => {
  const nlPhrase = useWizardStore(state => state.nlPhrase);

  // Don't render if no phrase and not generating
  if (!nlPhrase.currentPhrase && !nlPhrase.isGenerating && !nlPhrase.error) {
    return null;
  }

  return (
    <div className="mt-2 text-[0.4375rem] leading-tight">
      <div className="text-neutral-500 mb-0.5">AI-Generated Description:</div>

      {nlPhrase.isGenerating && (
        <div className="text-neutral-400 italic flex items-center gap-1">
          <span className="animate-pulse">●</span>
          Generating phrase...
        </div>
      )}

      {nlPhrase.error && (
        <div className="text-red-400 italic">
          {nlPhrase.error}
        </div>
      )}

      {nlPhrase.currentPhrase && !nlPhrase.isGenerating && (
        <div className="text-neutral-300 line-clamp-2">
          {nlPhrase.currentPhrase}
        </div>
      )}
    </div>
  );
};
