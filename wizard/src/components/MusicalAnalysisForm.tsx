import React, { useCallback } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface MusicalAnalysis {
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
}

interface ValidationError {
  field: string;
  message: string;
  invalid_value?: any;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: string[];
  suggestions?: string[];
}

interface MusicalAnalysisFormProps {
  analysis?: MusicalAnalysis;
  onChange: (field: string, value: any) => void;
  validation?: ValidationResult;
}

interface FieldProps {
  label: string;
  description?: string;
  error?: string;
  warning?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, description, error, warning, children }) => {
  return (
    <div className="field">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {error && <ExclamationCircleIcon className="w-4 h-4 text-red-500" />}
        {warning && !error && <InformationCircleIcon className="w-4 h-4 text-yellow-500" />}
      </div>

      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{description}</p>
      )}

      {children}

      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      {warning && !error && (
        <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">{warning}</p>
      )}
    </div>
  );
};

const MusicalAnalysisForm: React.FC<MusicalAnalysisFormProps> = ({
  analysis = {},
  onChange,
  validation
}) => {
  const validationErrors = validation?.errors || [];
  const warnings = validation?.warnings || [];

  // Helper to get error for a specific field
  const getFieldError = useCallback((fieldName: string) => {
    return validationErrors.find(error =>
      error.field === fieldName ||
      error.field === `musical_analysis.${fieldName}` ||
      error.field.endsWith(`.${fieldName}`)
    )?.message;
  }, [validationErrors]);

  // Helper to get warning for a specific field
  const getFieldWarning = useCallback((fieldName: string) => {
    return warnings.find(warning =>
      warning.toLowerCase().includes(fieldName.toLowerCase())
    );
  }, [warnings]);

  // Handle numeric input changes
  const handleNumericChange = useCallback((field: string, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onChange(field, numValue);
  }, [onChange]);

  // Handle string input changes
  const handleStringChange = useCallback((field: string, value: string) => {
    onChange(field, value === '' ? undefined : value);
  }, [onChange]);

  // Get analysis validation status
  const hasAnalysisErrors = validationErrors.some(error =>
    error.field.includes('musical_analysis') && !error.field.includes('semantic_attributes')
  );

  // Common key signatures for dropdown
  const keySignatures = [
    'C major', 'G major', 'D major', 'A major', 'E major', 'B major', 'F# major',
    'C# major', 'F major', 'Bb major', 'Eb major', 'Ab major', 'Db major',
    'Gb major', 'Cb major', 'A minor', 'E minor', 'B minor', 'F# minor',
    'C# minor', 'G# minor', 'D# minor', 'A# minor', 'D minor', 'G minor',
    'C minor', 'F minor', 'Bb minor', 'Eb minor', 'Ab minor'
  ];

  // Common time signatures
  const timeSignatures = ['4/4', '3/4', '2/4', '6/8', '9/8', '12/8', '5/4', '7/8'];

  // Common genres
  const genres = [
    'rock', 'pop', 'jazz', 'classical', 'electronic', 'hip-hop', 'folk', 'blues',
    'country', 'reggae', 'funk', 'soul', 'r&b', 'metal', 'punk', 'alternative',
    'ambient', 'house', 'techno', 'trance', 'drum-and-bass', 'dubstep'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Musical Analysis
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Technical and perceptual analysis parameters
          </p>
        </div>
        {validation && (
          <div className="flex items-center space-x-2">
            {validation.valid && !hasAnalysisErrors ? (
              <CheckCircleIcon className="w-6 h-6 text-green-500" title="Valid" />
            ) : hasAnalysisErrors ? (
              <ExclamationCircleIcon className="w-6 h-6 text-red-500" title="Validation errors" />
            ) : null}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tempo Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Tempo & Rhythm
          </h3>

          <Field
            label="Tempo (BPM)"
            description="Beats per minute"
            error={getFieldError('tempo')}
            warning={getFieldWarning('tempo')}
          >
            <input
              type="number"
              min="20"
              max="300"
              step="0.1"
              value={analysis.tempo || ''}
              onChange={(e) => handleNumericChange('tempo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="120"
            />
          </Field>

          <Field
            label="Tempo Confidence"
            description="Confidence in tempo detection (0-1)"
            error={getFieldError('tempo_confidence')}
          >
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={analysis.tempo_confidence || ''}
              onChange={(e) => handleNumericChange('tempo_confidence', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.85"
            />
          </Field>

          <Field
            label="Time Signature"
            description="Meter of the music"
            error={getFieldError('time_signature')}
          >
            <select
              value={analysis.time_signature || ''}
              onChange={(e) => handleStringChange('time_signature', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select time signature</option>
              {timeSignatures.map(sig => (
                <option key={sig} value={sig}>{sig}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Harmony Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Harmony & Tonality
          </h3>

          <Field
            label="Key Signature"
            description="Tonal center and mode"
            error={getFieldError('key_signature')}
          >
            <select
              value={analysis.key_signature || ''}
              onChange={(e) => handleStringChange('key_signature', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select key signature</option>
              {keySignatures.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </Field>

          <Field
            label="Key Confidence"
            description="Confidence in key detection (0-1)"
            error={getFieldError('key_confidence')}
          >
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={analysis.key_confidence || ''}
              onChange={(e) => handleNumericChange('key_confidence', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.78"
            />
          </Field>

          <Field
            label="Genre"
            description="Musical style or genre"
            error={getFieldError('genre')}
          >
            <select
              value={analysis.genre || ''}
              onChange={(e) => handleStringChange('genre', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Audio Features Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Audio Features
          </h3>

          <Field
            label="Energy"
            description="Perceptual measure of intensity (0-1)"
            error={getFieldError('energy')}
            warning={getFieldWarning('energy')}
          >
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={analysis.energy || ''}
              onChange={(e) => handleNumericChange('energy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.7"
            />
          </Field>

          <Field
            label="Valence"
            description="Musical positivity (0-1)"
            error={getFieldError('valence')}
            warning={getFieldWarning('valence')}
          >
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={analysis.valence || ''}
              onChange={(e) => handleNumericChange('valence', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.8"
            />
          </Field>

          <Field
            label="Danceability"
            description="Suitability for dancing (0-1)"
            error={getFieldError('danceability')}
          >
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={analysis.danceability || ''}
              onChange={(e) => handleNumericChange('danceability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.6"
            />
          </Field>
        </div>

        {/* Additional Features Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Additional Features
          </h3>

          <Field
            label="Instrumentalness"
            description="Probability of no vocals (0-1)"
            error={getFieldError('instrumentalness')}
          >
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={analysis.instrumentalness || ''}
              onChange={(e) => handleNumericChange('instrumentalness', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.9"
            />
          </Field>

          <Field
            label="Acousticness"
            description="Acoustic vs electronic (0-1)"
            error={getFieldError('acousticness')}
          >
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={analysis.acousticness || ''}
              onChange={(e) => handleNumericChange('acousticness', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.3"
            />
          </Field>

          <Field
            label="Speechiness"
            description="Presence of spoken words (0-1)"
            error={getFieldError('speechiness')}
          >
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={analysis.speechiness || ''}
              onChange={(e) => handleNumericChange('speechiness', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="0.1"
            />
          </Field>

          <Field
            label="Loudness"
            description="Overall loudness in dB"
            error={getFieldError('loudness')}
          >
            <input
              type="number"
              min="-60"
              max="0"
              step="0.1"
              value={analysis.loudness || ''}
              onChange={(e) => handleNumericChange('loudness', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="-12.5"
            />
          </Field>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Fields</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {Object.values(analysis).filter(v => v !== undefined && v !== null && v !== '').length}
            </div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Confidence</div>
            <div className="text-lg font-semibold text-blue-900 dark:text-blue-400">
              {analysis.tempo_confidence || analysis.key_confidence ?
                Math.round((((analysis.tempo_confidence || 0) + (analysis.key_confidence || 0)) /
                (analysis.tempo_confidence ? 1 : 0) + (analysis.key_confidence ? 1 : 0)) * 100) + '%' :
                'N/A'
              }
            </div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm font-medium text-green-600 dark:text-green-400">Valid</div>
            <div className="text-lg font-semibold text-green-900 dark:text-green-400">
              {hasAnalysisErrors ? 'No' : 'Yes'}
            </div>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Warnings</div>
            <div className="text-lg font-semibold text-yellow-900 dark:text-yellow-400">
              {warnings.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicalAnalysisForm;
