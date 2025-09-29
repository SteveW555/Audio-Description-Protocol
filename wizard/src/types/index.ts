// Type definitions for the Audio Description Protocol Wizard

export interface SemanticAttributes {
  mood: string[];
  energy: string[];
  texture: string[];
}

export interface MusicalAnalysis {
  tempo?: number;
  tempo_confidence?: number;
  key_signature?: string;
  key_confidence?: number;
  time_signature?: string;
  genre?: string;
  energy?: number;
  valence?: number;
  danceability?: number;
  instrumentalness?: number;
  acousticness?: number;
  loudness?: number;
  speechiness?: number;
  semantic_attributes?: SemanticAttributes;
}

export interface TimeRange {
  start_sec: number;
  end_sec: number;
}

export interface Label {
  entry_id: string;
  confidence: number;
}

export interface Provenance {
  annotator_type: 'human' | 'ai';
  timestamp: string;
  annotator_id?: string;
  tool_version?: string;
  session_id?: string;
}

export interface MusicalAnnotation {
  id?: string;
  clip_id?: string;
  annotation_type?: 'musical';
  musical_analysis?: MusicalAnalysis;
  time_range?: TimeRange;
  labels?: Label[];
  provenance?: Provenance;
  schema_version?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  invalid_value?: any;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: string[];
  suggestions?: string[];
}

export interface TaxonomyTerm {
  id: string;
  term: string;
  freq: 'rare' | 'infrequent' | 'frequent' | 'ubiquitous';
  desc: string;
  figurative?: boolean;
  aliases?: string[];
  examples?: string[];
  sources?: string[];
  meta?: Record<string, any>;
}

export interface WizardSettings {
  showPreview: boolean;
  previewFormat: 'json' | 'python' | 'yaml' | 'typescript';
  autoValidate: boolean;
  previewTheme: 'light' | 'dark';
  splitMode: 'horizontal' | 'vertical';
}