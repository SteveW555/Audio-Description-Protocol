import { memo, useMemo } from 'react';

import { useWizardStore } from '../context/WizardContext';
import { highlightJsonString } from '../utils/jsonHighlight';
import type { ValidationResult, WizardSettings } from '@/types';

interface JsonPreviewProps {
    data?: unknown;
    validation?: ValidationResult | null;
    format?: WizardSettings['previewFormat'];
    theme?: WizardSettings['previewTheme'];
    onFormatChange?: (format: WizardSettings['previewFormat']) => void;
}

const formatLabels: Record<WizardSettings['previewFormat'], string> = {
    json: 'JSON',
    python: 'Python',
    yaml: 'YAML',
    typescript: 'TypeScript',
};

export const JsonPreview = memo(({ data, validation, format = 'json', theme = 'dark', onFormatChange }: JsonPreviewProps) => {
    const storeData = useWizardStore((state) => state.data);
    const previewData = data ?? storeData;

    const highlightedJson = useMemo(() => highlightJsonString(previewData), [previewData]);

    return (
        <div className={`h-full rounded-lg overflow-hidden border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <div className={`flex items-center justify-between px-4 py-2 text-xs font-semibold ${theme === 'dark' ? 'text-gray-300 bg-gray-800 border-b border-gray-700' : 'text-gray-700 bg-gray-100 border-b border-gray-200'}`}>
                <span>Preview | {formatLabels[format]}</span>
                {onFormatChange && (
                    <div className="space-x-1">
                        {(Object.keys(formatLabels) as Array<WizardSettings['previewFormat']>).map(option => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => onFormatChange(option)}
                                className={`px-2 py-1 rounded ${option === format ? 'bg-blue-600 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {formatLabels[option]}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="p-4 overflow-auto h-full">
                <pre
                    className={`text-[11px] whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}
                    dangerouslySetInnerHTML={{ __html: highlightedJson }}
                />
            </div>
            {validation && !validation.valid && validation.errors.length > 0 && (
                <div className="px-4 py-2 text-xs bg-red-50 text-red-600 border-t border-red-200">
                    Validation Errors: {validation.errors.length}
                </div>
            )}
        </div>
    );
});

JsonPreview.displayName = 'JsonPreview';
