import React from 'react';
import { memo } from 'react';
import { useWizardStore } from '../context/WizardContext';

export const HumanReadablePreview = memo(() => {
    const data = useWizardStore((state) => state.data);

    const formatArray = (arr: string[] | undefined) => {
        if (!arr || arr.length === 0) return 'None';
        return arr.filter(item => item !== 'tbc').join(', ') || 'TBC';
    };

    const formatValue = (val: any) => {
        if (!val || val === 'tbc') return 'TBC';
        return val;
    };

    return (
        <div className="h-full bg-gray-900 rounded-lg p-4 overflow-auto">
            <div className="text-[11px] text-gray-300 space-y-[5px] font-mono">
                {/* Genre Information */}
                <div>
                    <span className="text-blue-400">Genre:</span> {formatValue(data.semantic_description?.primary_genre)}
                </div>
                <div>
                    <span className="text-blue-400">Sub-genre:</span> {formatValue(data.semantic_description?.secondary_genre)}
                </div>

                {/* Semantic Attributes */}
                <div>
                    <span className="text-blue-400">Mood:</span> {formatArray(data.semantic_description?.attributes?.mood)}
                </div>
                <div>
                    <span className="text-blue-400">Energy:</span> {formatArray(data.semantic_description?.attributes?.energy)}
                </div>
                <div>
                    <span className="text-blue-400">Texture:</span> {formatArray(data.semantic_description?.attributes?.texture)}
                </div>

                {/* Featured Instruments */}
                {data.semantic_description?.instrumentation && data.semantic_description.instrumentation.length > 0 && (
                    <>
                        {data.semantic_description.instrumentation.map((inst: any, idx: number) => (
                            <div key={idx}>
                                <span className="text-blue-400">Featured Instrument {idx + 1}:</span> [{formatValue(inst.instrument)}], [Role: {formatValue(inst.role)}], [Instrument Descriptors: {formatArray(inst.descriptors)}]
                            </div>
                        ))}
                    </>
                )}

                {/* Vocals */}
                {data.semantic_description?.vocals && (
                    <div>
                        <span className="text-blue-400">Vocals:</span> [{formatValue(data.semantic_description.vocals.presence)}], [Gender: {formatValue(data.semantic_description.vocals.gender)}], [Style: {formatValue(data.semantic_description.vocals.style)}], [Vocal Descriptors: {formatArray(data.semantic_description.vocals.descriptors)}]
                    </div>
                )}

                {/* Music Theory */}
                {data.theory && (
                    <div className="mt-3">
                        <div className="text-blue-400">Music Theory:</div>
                        <div className="ml-2">{'{'}</div>
                        <div className="ml-4">BPM: {formatValue(data.theory.bpm)}</div>
                        <div className="ml-4">Key: {formatValue(data.theory.key)}, Scale: {formatValue(data.theory.scale)}</div>
                        <div className="ml-4">Chords: {formatValue(data.theory.chords)}</div>
                        <div className="ml-2">{'}'}</div>
                    </div>
                )}
            </div>
        </div>
    );
});

HumanReadablePreview.displayName = 'HumanReadablePreview';
