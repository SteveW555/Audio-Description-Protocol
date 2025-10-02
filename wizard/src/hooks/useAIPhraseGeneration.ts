import { useEffect, useMemo, useRef } from 'react';
import { debounce } from 'lodash';
import { useWizardStore } from '../context/WizardContext';
import { generatePhrase } from '../ai/aiPhraseGenerator';
import { canMakeRequest, trackRequest } from '../services/apiRateLimiter';
import { validatePhrase } from '../services/phraseValidator';

/**
 * Checks if wizard data has minimum required data (genre + at least one attribute per FR-007)
 */
function hasMinimumData(data: any): boolean {
  if (!data.genre?.primary) {
    return false;
  }

  // Check for at least one attribute
  return !!(
    (data.mood && data.mood.length > 0) ||
    (data.energy && data.energy.length > 0) ||
    (data.texture && data.texture.length > 0) ||
    (data.instrumentation && data.instrumentation.length > 0) ||
    (data.vocals && data.vocals.presence) ||
    (data.bpm !== undefined && data.bpm !== null)
  );
}

/**
 * Custom hook for AI phrase generation with debouncing and rate limiting
 * Implements FR-012 (750ms debounce), FR-011 (retry logic), FR-014 (validation)
 */
export function useAIPhraseGeneration() {
  const data = useWizardStore(state => state.data);
  const updateNLPhrase = useWizardStore(state => state.updateNLPhrase);
  const setNLGenerating = useWizardStore(state => state.setNLGenerating);
  const setNLError = useWizardStore(state => state.setNLError);

  const isGeneratingRef = useRef(false);

  /**
   * Generates phrase with error handling and retry logic
   */
  const generatePhraseInternal = async () => {
    // Prevent concurrent generation
    if (isGeneratingRef.current) {
      return;
    }

    // Check minimum data requirements
    if (!hasMinimumData(data)) {
      return;
    }

    // Check client-side rate limit
    const rateLimitCheck = canMakeRequest();
    if (!rateLimitCheck.allowed) {
      setNLError(rateLimitCheck.reason || 'Rate limit exceeded');
      return;
    }

    isGeneratingRef.current = true;
    setNLGenerating(true);
    setNLError(null);

    try {
      // Track request for client-side rate limiting
      trackRequest();

      // Generate phrase
      const response = await generatePhrase(data);

      // Validate phrase
      const validation = validatePhrase(response.phrase);
      if (!validation.isValid) {
        console.warn('Generated phrase validation failed:', validation.errors);

        // Retry once per FR-011
        try {
          const retryResponse = await generatePhrase(data);
          const retryValidation = validatePhrase(retryResponse.phrase);

          if (retryValidation.isValid) {
            updateNLPhrase(retryResponse.phrase);
          } else {
            setNLError('AI Phrase Update failed response');
          }
        } catch (retryError: any) {
          console.error('Retry failed:', retryError);
          setNLError('AI Phrase Update failed response');
        }
      } else {
        // Success
        updateNLPhrase(response.phrase);
      }
    } catch (error: any) {
      console.error('Error generating phrase:', error);

      // Check if retryable error (per FR-011)
      const isRetryable =
        error.message?.includes('429') ||
        error.message?.includes('500') ||
        error.message?.includes('timeout');

      if (isRetryable) {
        // Wait 2 seconds and retry once
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
          const retryResponse = await generatePhrase(data);
          updateNLPhrase(retryResponse.phrase);
        } catch (retryError: any) {
          console.error('Retry failed:', retryError);
          setNLError('AI Phrase Update failed response');
        }
      } else {
        setNLError('AI Phrase Update failed response');
      }
    } finally {
      isGeneratingRef.current = false;
      setNLGenerating(false);
    }
  };

  /**
   * Debounced phrase generation (750ms per FR-012)
   */
  const debouncedGenerate = useMemo(
    () =>
      debounce(generatePhraseInternal, 750, {
        leading: false,
        trailing: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /**
   * Trigger generation when wizard data changes
   */
  useEffect(() => {
    if (hasMinimumData(data)) {
      debouncedGenerate();
    }

    // Cleanup on unmount
    return () => {
      debouncedGenerate.cancel();
    };
  }, [data, debouncedGenerate]);

  // No return value needed - updates are handled via WizardContext
}
