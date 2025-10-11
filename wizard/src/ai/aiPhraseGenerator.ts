import { v4 as uuidv4 } from 'uuid';
import type { AIGenerationRequest, AIGenerationResponse } from '../types/wizard';
import type { AudioProtocolData } from '../types/protocol';
import { buildApiUrl } from '../config/api';

/**
 * Filters wizard data to exclude key, scale, and chords per FR-002
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

  // Explicitly exclude key, scale, chords per FR-002
  // (not included in filtered object)

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
 * Generates standardized phrase (AI-generated natural language description) by calling backend API
 * Takes structured wizard data following ADP vocabulary and returns a human-readable phrase
 *
 * @param wizardData - Partial wizard data following ADP vocabulary structure
 * @returns Standardized phrase with confidence, tokens, and cost metrics
 */
export async function generatePhrase(
  wizardData: Partial<AudioProtocolData>
): Promise<AIGenerationResponse> {
  const sessionId = getSessionId();
  const requestId = uuidv4();

  const filteredData = filterWizardData(wizardData);

  const request: AIGenerationRequest = {
    wizardData: filteredData,
    sessionId,
    requestId,
  };

  const response = await fetch(buildApiUrl('/api/generate-phrase'), {
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

  const data: AIGenerationResponse = await response.json();
  return data;
}
