import { v4 as uuidv4 } from 'uuid';
import type { AudioProtocolData } from '../types/protocol';

// Use relative URL for Vite proxy
const API_BASE_URL = '';

export interface CasualPhraseResponse {
  casualPhrase: string;
  confidence: number;
  tokensUsed: number;
  costUSD: number;
  requestId: string;
  timestamp: string;
}

/**
 * Filters wizard data to exclude key, scale, and chords
 */
function filterWizardData(data: Partial<AudioProtocolData>): any {
  const filtered: any = {};

  // Include allowed fields
  if ((data as any).genre) {
    filtered.genre = (data as any).genre;
  }

  if ((data as any).mood) {
    filtered.mood = (data as any).mood;
  }

  if ((data as any).energy) {
    filtered.energy = (data as any).energy;
  }

  if ((data as any).texture) {
    filtered.texture = (data as any).texture;
  }

  if ((data as any).instrumentation) {
    filtered.instrumentation = (data as any).instrumentation;
  }

  if ((data as any).vocals) {
    filtered.vocals = (data as any).vocals;
  }

  if ((data as any).bpm) {
    filtered.bpm = (data as any).bpm;
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
 * @returns Casual phrase with confidence, tokens, and cost metrics
 */
export async function generateCasualPhrase(
  wizardData: Partial<AudioProtocolData>
): Promise<CasualPhraseResponse> {
  const sessionId = getSessionId();
  const requestId = uuidv4();

  const filteredData = filterWizardData(wizardData);

  const request = {
    wizardData: filteredData,
    sessionId,
    requestId,
  };

  const response = await fetch(`${API_BASE_URL}/api/generate-casual-phrase`, {
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
