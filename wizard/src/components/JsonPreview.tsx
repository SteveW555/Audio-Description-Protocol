import React, { useState, useMemo, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  ClipboardIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

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

interface JsonPreviewProps {
  data: any;
  validation?: ValidationResult;
  format?: 'json' | 'python' | 'yaml' | 'typescript';
  theme?: 'light' | 'dark';
  onFormatChange?: (format: string) => void;
}

const JsonPreview: React.FC<JsonPreviewProps> = ({
  data,
  validation,
  format = 'json',
  theme = 'dark',
  onFormatChange
}) => {
  const [activeFormat, setActiveFormat] = useState(format);
  const [copySuccess, setCopySuccess] = useState(false);

  // Format the data based on selected format
  const formattedCode = useMemo(() => {
    try {
      switch (activeFormat) {
        case 'json':
          return JSON.stringify(data, null, 2);
        case 'python':
          return generatePythonCode(data);
        case 'yaml':
          return generateYamlCode(data);
        case 'typescript':
          return generateTypeScriptCode(data);
        default:
          return JSON.stringify(data, null, 2);
      }
    } catch (error) {
      return `Error formatting ${activeFormat}: ${error.message}`;
    }
  }, [data, activeFormat]);

  // Get syntax highlighting style
  const syntaxStyle = theme === 'dark' ? vscDarkPlus : prism;

  // Handle format change
  const handleFormatChange = useCallback((newFormat: string) => {
    setActiveFormat(newFormat);
    onFormatChange?.(newFormat);
  }, [onFormatChange]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formattedCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [formattedCode]);

  // Download as file
  const handleDownload = useCallback(() => {
    const extension = getFileExtension(activeFormat);
    const mimeType = getMimeType(activeFormat);

    const blob = new Blob([formattedCode], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `musical-annotation.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  }, [formattedCode, activeFormat]);

  // Get validation status icon
  const getValidationIcon = () => {
    if (!validation) return null;

    if (validation.valid) {
      return (
        <CheckCircleIcon className="w-5 h-5 text-green-500" title="Valid" />
      );
    }

    if (validation.errors?.length > 0) {
      return (
        <XCircleIcon className="w-5 h-5 text-red-500" title="Validation errors" />
      );
    }

    if (validation.warnings?.length > 0) {
      return (
        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" title="Warnings" />
      );
    }

    return null;
  };

  return (
    <div className="json-preview flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      <div className="preview-header flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Format Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {['json', 'python', 'yaml', 'typescript'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleFormatChange(fmt)}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  activeFormat === fmt
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Validation Status */}
          <div className="flex items-center space-x-2">
            {getValidationIcon()}
            {validation && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {validation.valid ? 'Valid' : `${validation.errors?.length || 0} errors`}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Copy to clipboard"
          >
            {copySuccess ? (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            ) : (
              <ClipboardIcon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Download file"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="preview-content flex-1 overflow-hidden">
        <SyntaxHighlighter
          language={activeFormat === 'typescript' ? 'typescript' : activeFormat}
          style={syntaxStyle}
          customStyle={{
            margin: 0,
            height: '100%',
            background: 'transparent',
          }}
          wrapLongLines={true}
          showLineNumbers={true}
        >
          {formattedCode}
        </SyntaxHighlighter>
      </div>

      {/* Validation Details */}
      {validation && !validation.valid && (
        <div className="validation-details p-4 border-t border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
            Validation Errors
          </h4>
          <div className="space-y-1">
            {validation.errors?.map((error, index) => (
              <div key={index} className="text-sm text-red-700 dark:text-red-300">
                <span className="font-medium">{error.field}:</span> {error.message}
              </div>
            ))}
          </div>

          {validation.suggestions && validation.suggestions.length > 0 && (
            <div className="mt-3">
              <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                Suggestions
              </h5>
              <div className="space-y-1">
                {validation.suggestions.map((suggestion, index) => (
                  <div key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                    • {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Warnings */}
      {validation?.warnings && validation.warnings.length > 0 && (
        <div className="warnings p-4 border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">
            Warnings
          </h4>
          <div className="space-y-1">
            {validation.warnings.map((warning, index) => (
              <div key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                • {warning}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for code generation
function generatePythonCode(data: any): string {
  const lines: string[] = [];

  lines.push('# Generated Python code for Musical Annotation');
  lines.push('from adp_core.models.musical_annotation import MusicalAnnotation, MusicalAnalysis');
  lines.push('from adp_core.taxonomy import SemanticAttributes');
  lines.push('');

  if (data.musical_analysis?.semantic_attributes) {
    const attrs = data.musical_analysis.semantic_attributes;
    lines.push('semantic_attributes = SemanticAttributes(');

    ['mood', 'energy', 'texture'].forEach(category => {
      if (attrs[category] && attrs[category].length > 0) {
        const terms = attrs[category].map((term: string) => `"${term}"`).join(', ');
        lines.push(`    ${category}=[${terms}],`);
      }
    });

    lines.push(')');
    lines.push('');
  }

  if (data.musical_analysis) {
    lines.push('musical_analysis = MusicalAnalysis(');

    Object.entries(data.musical_analysis).forEach(([key, value]) => {
      if (key === 'semantic_attributes') {
        lines.push('    semantic_attributes=semantic_attributes,');
      } else if (value !== null && value !== undefined) {
        if (typeof value === 'string') {
          lines.push(`    ${key}="${value}",`);
        } else {
          lines.push(`    ${key}=${JSON.stringify(value)},`);
        }
      }
    });

    lines.push(')');
  }

  return lines.join('\n');
}

function generateYamlCode(data: any): string {
  // Simple YAML generation - could use a proper YAML library
  const yamlLines: string[] = [];

  function addYamlValue(key: string, value: any, indent: number = 0) {
    const spaces = '  '.repeat(indent);

    if (Array.isArray(value)) {
      yamlLines.push(`${spaces}${key}:`);
      value.forEach(item => {
        yamlLines.push(`${spaces}  - ${typeof item === 'string' ? `"${item}"` : item}`);
      });
    } else if (typeof value === 'object' && value !== null) {
      yamlLines.push(`${spaces}${key}:`);
      Object.entries(value).forEach(([subKey, subValue]) => {
        addYamlValue(subKey, subValue, indent + 1);
      });
    } else {
      const valueStr = typeof value === 'string' ? `"${value}"` : value;
      yamlLines.push(`${spaces}${key}: ${valueStr}`);
    }
  }

  Object.entries(data).forEach(([key, value]) => {
    addYamlValue(key, value);
  });

  return yamlLines.join('\n');
}

function generateTypeScriptCode(data: any): string {
  const lines: string[] = [];

  lines.push('// Generated TypeScript code for Musical Annotation');
  lines.push('import { MusicalAnalysis, SemanticAttributes } from "./generated";');
  lines.push('');

  lines.push('const musicalAnalysis: MusicalAnalysis = {');

  if (data.musical_analysis) {
    Object.entries(data.musical_analysis).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === 'string') {
          lines.push(`  ${key}: "${value}",`);
        } else if (Array.isArray(value)) {
          const items = value.map(item => `"${item}"`).join(', ');
          lines.push(`  ${key}: [${items}],`);
        } else if (typeof value === 'object') {
          lines.push(`  ${key}: {`);
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (Array.isArray(subValue)) {
              const items = subValue.map(item => `"${item}"`).join(', ');
              lines.push(`    ${subKey}: [${items}],`);
            } else {
              lines.push(`    ${subKey}: ${JSON.stringify(subValue)},`);
            }
          });
          lines.push('  },');
        } else {
          lines.push(`  ${key}: ${JSON.stringify(value)},`);
        }
      }
    });
  }

  lines.push('};');
  return lines.join('\n');
}

function getFileExtension(format: string): string {
  switch (format) {
    case 'python': return 'py';
    case 'typescript': return 'ts';
    case 'yaml': return 'yml';
    default: return 'json';
  }
}

function getMimeType(format: string): string {
  switch (format) {
    case 'python': return 'text/x-python';
    case 'typescript': return 'text/typescript';
    case 'yaml': return 'text/yaml';
    default: return 'application/json';
  }
}

export default JsonPreview;