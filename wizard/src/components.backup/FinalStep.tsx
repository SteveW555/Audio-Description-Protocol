import React from 'react';
import { useState } from 'react';

import { useWizardStore } from '../context/WizardContext';

interface FinalStepProps {
    onRestart: () => void;
}

export const FinalStep = ({ onRestart }: FinalStepProps) => {
    const data = useWizardStore((state) => state.data);
    const [notification, setNotification] = useState('');
    const [actionTaken, setActionTaken] = useState(false);

    const jsonString = JSON.stringify(data, null, 2);

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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Protocol Generated</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
                You can now copy or download the structured JSON data.
            </p>
            {notification && (
                <div className="my-4 p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-center">
                    {notification}
                </div>
            )}
            <div className="flex flex-col gap-4 mt-6">
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={copyToClipboard}
                        className="h-12 px-6 w-full font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                    >
                        Copy to Clipboard
                    </button>
                    <button
                        type="button"
                        onClick={downloadJson}
                        className="h-12 px-6 w-full font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                    >
                        Download .json
                    </button>
                </div>
                <button
                    type="button"
                    onClick={onRestart}
                    disabled={!actionTaken}
                    className="h-12 px-6 w-full font-semibold text-white bg-slate-600 rounded-lg shadow-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Create New Record
                </button>
            </div>
        </div>
    );
};
