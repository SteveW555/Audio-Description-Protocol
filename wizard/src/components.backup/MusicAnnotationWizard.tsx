import React, { useState, useCallback, useEffect } from 'react';
import { useRealtimeValidation } from '@hooks/useRealtimeValidation';
import JsonPreview from './JsonPreview';
import SemanticAttributesForm from './SemanticAttributesForm';
import MusicalAnalysisForm from './MusicalAnalysisForm';
import type { MusicalAnnotation, MusicalAnalysis, WizardSettings, ValidationResult } from '@/types';
import {
  Bars3Icon,
  EyeIcon,
  EyeSlashIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

// Types are now imported from @/types

const MusicAnnotationWizard: React.FC = () => {
  const [annotation, setAnnotation] = useState<MusicalAnnotation>({
    annotation_type: 'musical',
    musical_analysis: {
      semantic_attributes: {
        mood: [],
        energy: [],
        texture: []
      }
    },
    time_range: {
      start_sec: 0,
      end_sec: 30
    },
    schema_version: '1.0'
  });

  const [settings, setSettings] = useState<WizardSettings>({
    showPreview: true,
    previewFormat: 'json',
    autoValidate: true,
    previewTheme: 'dark',
    splitMode: 'vertical'
  });

  const [showSettings, setShowSettings] = useState(false);

  // Real-time validation
  const { validation, isValidating } = useRealtimeValidation(
    annotation,
    settings.autoValidate ? 'annotation' : 'semantic'
  );

  // Handle form field changes
  const handleFormChange = useCallback((path: string, value: any) => {
    setAnnotation(prev => {
      const newAnnotation = { ...prev };
      const pathParts = path.split('.');

      let current = newAnnotation;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!(part in current)) {
          current[part] = {};
        }
        current = current[part];
      }

      current[pathParts[pathParts.length - 1]] = value;
      return newAnnotation;
    });
  }, []);

  // Handle semantic attributes changes
  const handleSemanticChange = useCallback((category: string, terms: string[]) => {
    handleFormChange(`musical_analysis.semantic_attributes.${category}`, terms);
  }, [handleFormChange]);

  // Handle musical analysis changes
  const handleAnalysisChange = useCallback((field: string, value: any) => {
    handleFormChange(`musical_analysis.${field}`, value);
  }, [handleFormChange]);

  // Handle settings changes
  const handleSettingsChange = useCallback((setting: keyof WizardSettings, value: any) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  }, []);

  // Get layout classes based on split mode
  const getLayoutClasses = () => {
    if (!settings.showPreview) {
      return 'w-full';
    }

    return settings.splitMode === 'vertical'
      ? 'flex-1 flex space-x-6'
      : 'flex-1 flex flex-col space-y-6';
  };

  const getFormClasses = () => {
    if (!settings.showPreview) return 'w-full';
    return settings.splitMode === 'vertical' ? 'w-1/2' : 'w-full';
  };

  const getPreviewClasses = () => {
    if (!settings.showPreview) return 'hidden';
    return settings.splitMode === 'vertical' ? 'w-1/2' : 'w-full';
  };

  return (
    <div className="music-annotation-wizard h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="wizard-header bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Musical Annotation Wizard
            </h1>
            {isValidating && (
              <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span>Validating...</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleSettingsChange('showPreview', !settings.showPreview)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title={settings.showPreview ? 'Hide preview' : 'Show preview'}
            >
              {settings.showPreview ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Settings"
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preview Format
                </label>
                <select
                  value={settings.previewFormat}
                  onChange={(e) => handleSettingsChange('previewFormat', e.target.value)}
                  className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="json">JSON</option>
                  <option value="python">Python</option>
                  <option value="yaml">YAML</option>
                  <option value="typescript">TypeScript</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Theme
                </label>
                <select
                  value={settings.previewTheme}
                  onChange={(e) => handleSettingsChange('previewTheme', e.target.value)}
                  className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Layout
                </label>
                <select
                  value={settings.splitMode}
                  onChange={(e) => handleSettingsChange('splitMode', e.target.value)}
                  className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="vertical">Side by Side</option>
                  <option value="horizontal">Top/Bottom</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoValidate"
                  checked={settings.autoValidate}
                  onChange={(e) => handleSettingsChange('autoValidate', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="autoValidate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto Validate
                </label>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={`flex-1 overflow-hidden ${getLayoutClasses()}`}>
        {/* Form Panel */}
        <div className={`${getFormClasses()} overflow-y-auto`}>
          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Clip ID
                  </label>
                  <input
                    type="text"
                    value={annotation.clip_id || ''}
                    onChange={(e) => handleFormChange('clip_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="audio_clip_001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Annotation ID
                  </label>
                  <input
                    type="text"
                    value={annotation.id || ''}
                    onChange={(e) => handleFormChange('id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="annotation_001"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Time (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={annotation.time_range?.start_sec || 0}
                    onChange={(e) => handleFormChange('time_range.start_sec', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Time (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={annotation.time_range?.end_sec || 30}
                    onChange={(e) => handleFormChange('time_range.end_sec', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Musical Analysis Form */}
            <MusicalAnalysisForm
              analysis={annotation.musical_analysis}
              onChange={handleAnalysisChange}
              validation={validation}
            />

            {/* Semantic Attributes Form */}
            <SemanticAttributesForm
              attributes={annotation.musical_analysis?.semantic_attributes}
              onChange={handleSemanticChange}
              validation={validation}
            />
          </div>
        </div>

        {/* Preview Panel */}
        {settings.showPreview && (
          <div className={getPreviewClasses()}>
            <JsonPreview
              data={annotation}
              validation={validation}
              format={settings.previewFormat}
              theme={settings.previewTheme}
              onFormatChange={(format) => handleSettingsChange('previewFormat', format)}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default MusicAnnotationWizard;