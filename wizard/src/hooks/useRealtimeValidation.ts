import { useState, useEffect, useMemo, useCallback } from 'react';
import { debounce } from 'lodash-es';

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

interface ApiValidationResponse {
  valid: boolean;
  errors: ValidationError[];
  warnings?: string[];
  suggestions?: string[];
}

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ValidationAPI {
  static async validateSemanticAttributes(attributes: any): Promise<ValidationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/validate/semantic-attributes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attributes),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Validation API error:', error);
      return {
        valid: false,
        errors: [{ field: 'api', message: `Validation service unavailable: ${error.message}` }],
      };
    }
  }

  static async validateMusicalAnalysis(analysis: any): Promise<ValidationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/validate/musical-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysis),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Validation API error:', error);
      return {
        valid: false,
        errors: [{ field: 'api', message: `Validation service unavailable: ${error.message}` }],
      };
    }
  }

  static async validateMusicalAnnotation(annotation: any): Promise<ValidationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/validate/musical-annotation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(annotation),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Validation API error:', error);
      return {
        valid: false,
        errors: [{ field: 'api', message: `Validation service unavailable: ${error.message}` }],
      };
    }
  }

  static async generateCode(data: any, format: string): Promise<{ code: string; valid: boolean; errors: string[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          format,
          include_comments: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Code generation API error:', error);
      return {
        code: '',
        valid: false,
        errors: [`Code generation service unavailable: ${error.message}`],
      };
    }
  }
}

// Hook for real-time validation of semantic attributes
export function useSemanticValidation(attributes: any, debounceMs: number = 300) {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const debouncedValidate = useMemo(
    () => debounce(async (attrs: any) => {
      if (!attrs || (!attrs.mood?.length && !attrs.energy?.length && !attrs.texture?.length)) {
        setValidation(null);
        setIsValidating(false);
        return;
      }

      setIsValidating(true);
      try {
        const result = await ValidationAPI.validateSemanticAttributes(attrs);
        setValidation(result);
      } catch (error) {
        setValidation({
          valid: false,
          errors: [{ field: 'validation', message: error.message }],
        });
      } finally {
        setIsValidating(false);
      }
    }, debounceMs),
    [debounceMs]
  );

  useEffect(() => {
    debouncedValidate(attributes);
    return () => debouncedValidate.cancel();
  }, [attributes, debouncedValidate]);

  return { validation, isValidating };
}

// Hook for real-time validation of complete musical analysis
export function useMusicalAnalysisValidation(analysis: any, debounceMs: number = 500) {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const debouncedValidate = useMemo(
    () => debounce(async (analysisData: any) => {
      if (!analysisData || Object.keys(analysisData).length === 0) {
        setValidation(null);
        setIsValidating(false);
        return;
      }

      setIsValidating(true);
      try {
        const result = await ValidationAPI.validateMusicalAnalysis(analysisData);
        setValidation(result);
      } catch (error) {
        setValidation({
          valid: false,
          errors: [{ field: 'validation', message: error.message }],
        });
      } finally {
        setIsValidating(false);
      }
    }, debounceMs),
    [debounceMs]
  );

  useEffect(() => {
    debouncedValidate(analysis);
    return () => debouncedValidate.cancel();
  }, [analysis, debouncedValidate]);

  return { validation, isValidating };
}

// Hook for real-time validation of complete annotation
export function useAnnotationValidation(annotation: any, debounceMs: number = 750) {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const debouncedValidate = useMemo(
    () => debounce(async (annotationData: any) => {
      if (!annotationData || Object.keys(annotationData).length === 0) {
        setValidation(null);
        setIsValidating(false);
        return;
      }

      setIsValidating(true);
      try {
        const result = await ValidationAPI.validateMusicalAnnotation(annotationData);
        setValidation(result);
      } catch (error) {
        setValidation({
          valid: false,
          errors: [{ field: 'validation', message: error.message }],
        });
      } finally {
        setIsValidating(false);
      }
    }, debounceMs),
    [debounceMs]
  );

  useEffect(() => {
    debouncedValidate(annotation);
    return () => debouncedValidate.cancel();
  }, [annotation, debouncedValidate]);

  return { validation, isValidating };
}

// Combined hook for comprehensive real-time validation
export function useRealtimeValidation(data: any, validationType: 'semantic' | 'analysis' | 'annotation' = 'annotation') {
  const semanticValidation = useSemanticValidation(
    data?.musical_analysis?.semantic_attributes,
    validationType === 'semantic' ? 300 : 0
  );

  const analysisValidation = useMusicalAnalysisValidation(
    data?.musical_analysis,
    validationType === 'analysis' ? 500 : 0
  );

  const annotationValidation = useAnnotationValidation(
    data,
    validationType === 'annotation' ? 750 : 0
  );

  // Return the appropriate validation result based on type
  switch (validationType) {
    case 'semantic':
      return semanticValidation;
    case 'analysis':
      return analysisValidation;
    case 'annotation':
      return annotationValidation;
    default:
      return annotationValidation;
  }
}

// Hook for taxonomy term search and suggestions
export function useTaxonomySearch(query: string, category?: string) {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useMemo(
    () => debounce(async (searchQuery: string) => {
      if (!searchQuery || searchQuery.length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams({ query: searchQuery });
        if (category) params.append('category', category);

        const response = await fetch(`${API_BASE_URL}/api/taxonomy/search?${params}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error('Taxonomy search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [category]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  return { results, isLoading };
}

// Export API class for direct use
export { ValidationAPI };