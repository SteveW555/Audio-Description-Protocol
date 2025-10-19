import React from 'react';
import { useState, useEffect } from 'react';

import { useWizardStore } from '../context/WizardContext';
import { usageTracker } from '../services/usageTracking';

interface FinalStepProps {
    onRestart: () => void;
    onBack?: () => void;
    structurePhrase?: string;
    structurePhraseLoading?: boolean;
    structurePhraseError?: string | null;
    casualPhrase?: string;
    casualPhraseLoading?: boolean;
    casualPhraseError?: string | null;
    onRegenerateCasualPhrase?: () => void;
    onReRandomizeAll?: () => void;
}

export const FinalStep = ({
    onRestart,
    onBack,
    structurePhrase,
    structurePhraseLoading,
    structurePhraseError,
    casualPhrase,
    casualPhraseLoading,
    casualPhraseError,
    onRegenerateCasualPhrase,
    onReRandomizeAll
}: FinalStepProps) => {
    const data = useWizardStore((state) => state.data);
    const [notification, setNotification] = useState('');
    const [actionTaken, setActionTaken] = useState(false);

    const jsonString = JSON.stringify(data, null, 2);

    // Track wizard completion when component mounts
    useEffect(() => {
        usageTracker.track({
            buttonName: 'wizard-completed',
            inputPhrase: null,
            responsePhrase: null,
            resultJson: data
        });
    }, []); // Empty dependency array = run once on mount

    const copyToClipboard = () => {
        const textArea = document.createElement('textarea');
        textArea.value = jsonString;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            setNotification(successful ? 'JSON copied to clipboard!' : 'Failed to copy JSON.');
            if (successful) setActionTaken(true);
        } catch (err) {
            setNotification('Failed to copy JSON.');
        }

        document.body.removeChild(textArea);
        window.setTimeout(() => setNotification(''), 3000);
    };

    const downloadJson = () => {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${data.path.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'audio-protocol'}.json`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        setActionTaken(true);
    };

    return (
        <div className="p-1">
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-2 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    &larr; Back
                </button>
            )}
            <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-1">Protocol Generated</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-4">
                You can now copy or download the structured JSON data.
            </p>
            {notification && (
                <div className="my-4 p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-center">
                    {notification}
                </div>
            )}

            <div className="flex flex-col gap-2 mt-6">
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={copyToClipboard}
                        className="h-12 px-6 w-full font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Copy to Clipboard
                    </button>
                    <button
                        type="button"
                        onClick={downloadJson}
                        className="h-12 px-6 w-full font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-colors"
                    >
                        Download .json
                    </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center my-2">
                    *Note: In production the result will be injected directly into the database or training set
                </p>
                <button
                    type="button"
                    onClick={onRestart}
                    className="h-12 px-6 w-full font-semibold text-white bg-slate-500 rounded-lg shadow-md hover:bg-slate-600 transition-colors"
                >
                    Create New Record
                </button>
            </div>

            {/* Generated Phrase Display */}
            {(structurePhrase || structurePhraseLoading || structurePhraseError) && (
                <div className="mt-6">
                    <label
                        htmlFor="generated-phrase"
                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                        title="A fixed, Structured Phrase representing the description terms"
                    >
                        Standardized phrase from structured descriptions:
                    </label>
                    <div className="flex gap-2">
                        <div
                            className="flex-1 p-4 border-2 border-teal-300 dark:border-teal-600 rounded-lg bg-teal-50 dark:bg-teal-900/20"
                            title="A fixed, Structured Phrase representing the description terms"
                        >
                            {structurePhraseLoading ? (
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                    Generating phrase from structure...
                                </p>
                            ) : structurePhraseError ? (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    Error: {structurePhraseError}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                    {structurePhrase}
                                </p>
                            )}
                        </div>
                        {onReRandomizeAll && (
                            <button
                                type="button"
                                onClick={onReRandomizeAll}
                                disabled={structurePhraseLoading || casualPhraseLoading}
                                className="w-32 px-3 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center leading-tight"
                                title="Re-randomize all structured keyword terms, then build the structured phrase"
                            >
                                Re-Randomize Wizard
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Casual Phrase Display */}
            {(casualPhrase || casualPhraseLoading || casualPhraseError) && (
                <div className="mt-6">
                    <label
                        htmlFor="casual-phrase"
                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                        title="A novel creative phrase, a human version of the Structured Phrase. Internally the system will first translate the human phrase to the Structured Phrase, and then derive the Keyword descriptive terms"
                    >
                        Casual phrase from wizard structure:
                    </label>
                    <div className="flex gap-2">
                        <div
                            className="flex-1 p-4 border-2 border-purple-300 dark:border-purple-600 rounded-lg bg-purple-50 dark:bg-purple-900/20"
                            title="A novel creative phrase, a human version of the Structured Phrase. Internally the system will first translate the human phrase to the Structured Phrase, and then derive the Keyword descriptive terms"
                        >
                            {casualPhraseLoading ? (
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                    Generating casual phrase...
                                </p>
                            ) : casualPhraseError ? (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    Error: {casualPhraseError}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                    {casualPhrase}
                                </p>
                            )}
                        </div>
                        {onRegenerateCasualPhrase && (
                            <button
                                type="button"
                                onClick={onRegenerateCasualPhrase}
                                disabled={casualPhraseLoading}
                                className="w-32 px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center leading-tight"
                                title="Imagine a new, creative human-like way to describe the track"
                            >
                                Re-Roll Casual Phrase
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
