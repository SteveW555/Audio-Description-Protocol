import { v4 as uuidv4 } from 'uuid';
import type { AudioProtocolData } from '../types/protocol';
import { buildApiUrl } from '../config/api';

export interface CasualPhraseResponse {
  casualPhrase: string;
  confidence: number;
  tokensUsed: number;
  costUSD: number;
  requestId: string;
  timestamp: string;
}

/**
 * Filters wizard data to extract semantic description fields
 * Maps from AudioProtocolData structure to backend WizardData structure
 */
function filterWizardData(data: Partial<AudioProtocolData>): any {
  const filtered: any = {};

  // Extract from semantic_description
  const semantic = data.semantic_description;
  if (semantic) {
    if (semantic.genre) {
      filtered.genre = semantic.genre;
    }

    if (semantic.attributes?.mood) {
      filtered.mood = semantic.attributes.mood;
    }

    if (semantic.attributes?.energy) {
      filtered.energy = semantic.attributes.energy;
    }

    if (semantic.attributes?.texture) {
      filtered.texture = semantic.attributes.texture;
    }

    if (semantic.instrumentation) {
      filtered.instrumentation = semantic.instrumentation;
    }

    if (semantic.vocals) {
      filtered.vocals = semantic.vocals;
    }
  }

  // Extract BPM from theory
  if (data.theory?.bpm) {
    filtered.bpm = data.theory.bpm;
  }

  return filtered;
}

/**
 * Gets or creates session ID from sessionStorage
 */
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('audio-protocol-session-id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('audio-protocol-session-id', sessionId);
  }
  return sessionId;
}

/**
 * Generates casual phrase (informal/colloquial description) by calling backend API
 * Takes structured wizard data following ADP vocabulary and returns a creative casual phrase
 *
 * @param wizardData - Partial wizard data following ADP vocabulary structure
 * @param poeticLevel - Style level from 1 (very poetic) to 100 (very factual), defaults to 50
 * @returns Casual phrase with confidence, tokens, and cost metrics
 */
export async function generateCasualPhrase(
  wizardData: Partial<AudioProtocolData>,
  poeticLevel: number = 50
): Promise<CasualPhraseResponse> {
  const sessionId = getSessionId();
  const requestId = uuidv4();

  const filteredData = filterWizardData(wizardData);

  const request = {
    wizardData: filteredData,
    sessionId,
    requestId,
    poeticLevel,
  };

  const response = await fetch(buildApiUrl('/api/generate-casual-phrase'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  const data: CasualPhraseResponse = await response.json();
  return data;
}
