import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useTaxonomySearch } from '../hooks/useRealtimeValidation';

interface SemanticAttributes {
  mood: string[];
  energy: string[];
  texture: string[];
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

interface SemanticAttributesFormProps {
  attributes?: SemanticAttributes;
  onChange: (category: string, terms: string[]) => void;
  validation?: ValidationResult;
}

interface TermSelectorProps {
  category: 'mood' | 'energy' | 'texture';
  selectedTerms: string[];
  onTermsChange: (terms: string[]) => void;
  validationErrors: ValidationError[];
}

const TermSelector: React.FC<TermSelectorProps> = ({
  category,
  selectedTerms,
  onTermsChange,
  validationErrors
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results: searchResults, isLoading } = useTaxonomySearch(inputValue, category);

  // Get validation errors for this category
  const categoryErrors = validationErrors.filter(error =>
    error.field.includes(`semantic_attributes.${category}`)
  );

  // Handle adding a new term
  const handleAddTerm = useCallback((term: string) => {
    const trimmedTerm = term.trim();
    if (trimmedTerm && !selectedTerms.includes(trimmedTerm)) {
      onTermsChange([...selectedTerms, trimmedTerm]);
    }
    setInputValue('');
    setShowSuggestions(false);
    setFocusedSuggestion(-1);
  }, [selectedTerms, onTermsChange]);

  // Handle removing a term
  const handleRemoveTerm = useCallback((termToRemove: string) => {
    onTermsChange(selectedTerms.filter(term => term !== termToRemove));
  }, [selectedTerms, onTermsChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedSuggestion(prev =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedSuggestion(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedSuggestion >= 0 && searchResults[focusedSuggestion]) {
          handleAddTerm(searchResults[focusedSuggestion].term);
        } else if (inputValue.trim()) {
          handleAddTerm(inputValue);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedSuggestion(-1);
        break;
      case 'Tab':
        if (focusedSuggestion >= 0 && searchResults[focusedSuggestion]) {
          e.preventDefault();
          handleAddTerm(searchResults[focusedSuggestion].term);
        }
        break;
    }
  }, [showSuggestions, focusedSuggestion, searchResults, inputValue, handleAddTerm]);

  // Check if a term is invalid
  const isInvalidTerm = useCallback((term: string) => {
    return categoryErrors.some(error =>
      error.message.includes(`'${term}'`) || error.invalid_value === term
    );
  }, [categoryErrors]);

  // Get category display info
  const getCategoryInfo = () => {
    switch (category) {
      case 'mood':
        return {
          title: 'Mood',
          description: 'Emotional character and feeling',
          placeholder: 'Search mood terms (e.g., upbeat, melancholic, peaceful)...',
          color: 'blue'
        };
      case 'energy':
        return {
          title: 'Energy',
          description: 'Kinetic intensity and drive',
          placeholder: 'Search energy terms (e.g., high-energy, laid-back, driving)...',
          color: 'green'
        };
      case 'texture':
        return {
          title: 'Texture',
          description: 'Sonic quality and timbre',
          placeholder: 'Search texture terms (e.g., warm, bright, gritty)...',
          color: 'purple'
        };
    }
  };

  const categoryInfo = getCategoryInfo();

  return (
    <div className="term-selector">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {categoryInfo.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {categoryInfo.description}
          </p>
        </div>
        {categoryErrors.length > 0 && (
          <ExclamationCircleIcon className="w-5 h-5 text-red-500" title="Validation errors" />
        )}
      </div>

      {/* Selected Terms */}
      <div className="selected-terms mb-3 min-h-[2.5rem] p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
        <div className="flex flex-wrap gap-2">
          {selectedTerms.map((term, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                isInvalidTerm(term)
                  ? 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700'
                  : `bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800 dark:bg-${categoryInfo.color}-900/20 dark:text-${categoryInfo.color}-400`
              }`}
            >
              {term}
              <button
                onClick={() => handleRemoveTerm(term)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                title="Remove term"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Term Input */}
      <div className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
              setFocusedSuggestion(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={categoryInfo.placeholder}
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (inputValue.length >= 2 || searchResults.length > 0) && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {isLoading && (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                Searching...
              </div>
            )}

            {!isLoading && searchResults.length === 0 && inputValue.length >= 2 && (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No results found. Press Enter to add "{inputValue}" as a custom term.
              </div>
            )}

            {!isLoading && searchResults.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleAddTerm(result.term)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  index === focusedSuggestion ? 'bg-blue-100 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {result.term}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {result.desc}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`px-1.5 py-0.5 text-xs rounded ${
                      result.freq === 'ubiquitous' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      result.freq === 'frequent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      result.freq === 'infrequent' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {result.freq}
                    </span>
                    {result.figurative && (
                      <span className="text-xs text-purple-600 dark:text-purple-400" title="Figurative/metaphorical">
                        fig
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Term Button */}
      {inputValue.trim() && !searchResults.some(r => r.term.toLowerCase() === inputValue.toLowerCase()) && (
        <button
          onClick={() => handleAddTerm(inputValue)}
          className="mt-2 w-full flex items-center justify-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add "{inputValue}" as custom term
        </button>
      )}

      {/* Validation Errors for this category */}
      {categoryErrors.length > 0 && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {categoryErrors.map((error, index) => (
            <div key={index} className="flex items-start space-x-1">
              <ExclamationCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SemanticAttributesForm: React.FC<SemanticAttributesFormProps> = ({
  attributes = { mood: [], energy: [], texture: [] },
  onChange,
  validation
}) => {
  const validationErrors = validation?.errors || [];

  // Get validation status for the semantic attributes section
  const hasSemanticErrors = validationErrors.some(error =>
    error.field.includes('semantic_attributes')
  );

  const semanticSuggestions = validation?.suggestions?.filter(suggestion =>
    suggestion.toLowerCase().includes('mood') ||
    suggestion.toLowerCase().includes('energy') ||
    suggestion.toLowerCase().includes('texture')
  ) || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Semantic Attributes
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Describe the mood, energy, and texture using taxonomy terms
          </p>
        </div>
        {validation && (
          <div className="flex items-center space-x-2">
            {validation.valid && !hasSemanticErrors ? (
              <CheckCircleIcon className="w-6 h-6 text-green-500" title="Valid" />
            ) : hasSemanticErrors ? (
              <ExclamationCircleIcon className="w-6 h-6 text-red-500" title="Validation errors" />
            ) : null}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <TermSelector
          category="mood"
          selectedTerms={attributes.mood}
          onTermsChange={(terms) => onChange('mood', terms)}
          validationErrors={validationErrors}
        />

        <TermSelector
          category="energy"
          selectedTerms={attributes.energy}
          onTermsChange={(terms) => onChange('energy', terms)}
          validationErrors={validationErrors}
        />

        <TermSelector
          category="texture"
          selectedTerms={attributes.texture}
          onTermsChange={(terms) => onChange('texture', terms)}
          validationErrors={validationErrors}
        />
      </div>

      {/* Suggestions */}
      {semanticSuggestions.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
            Suggestions
          </h4>
          <div className="space-y-1">
            {semanticSuggestions.map((suggestion, index) => (
              <div key={index} className="text-sm text-blue-700 dark:text-blue-300">
                • {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {attributes.mood.length}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Mood terms</div>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            {attributes.energy.length}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">Energy terms</div>
        </div>
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
            {attributes.texture.length}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">Texture terms</div>
        </div>
      </div>
    </div>
  );
};

export default SemanticAttributesForm;