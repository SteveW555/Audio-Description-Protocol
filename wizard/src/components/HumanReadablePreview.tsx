import React from 'react';
import { memo } from 'react';
import { useWizardStore } from '../context/WizardContext';

export const HumanReadablePreview = memo(() => {
    const data = useWizardStore((state) => state.data);

    const formatArray = (arr: string[] | undefined) => {
        if (!arr || arr.length === 0) return { text: 'None', isValid: false };
        const filtered = arr.filter(item => item !== 'tbc');
        if (filtered.length === 0) return { text: 'TBC', isValid: false };
        return { text: filtered.join(', '), isValid: true };
    };

    const formatValue = (val: any) => {
        if (!val || val === 'tbc') return { text: 'TBC', isValid: false };
        return { text: val, isValid: true };
    };

    const ValueSpan = ({ formatted }: { formatted: { text: string; isValid: boolean } }) => (
        <span className={formatted.isValid ? 'text-green-400' : 'text-gray-400'}>
            {formatted.text}
        </span>
    );

    return (
        <div className="h-full rounded-lg overflow-hidden border bg-gray-900 border-gray-800">
            <div className="flex items-center justify-between px-4 py-1 text-xs font-semibold text-gray-300 bg-gray-800 border-b border-gray-700">
                <span>Preview | Summary</span>
            </div>
            <div className="p-4 overflow-auto h-full">
                <div className="text-[11px] text-gray-300 space-y-[5px] font-mono">
                {/* Genre Information */}
                <div>
                    <span className="text-blue-400">Genre:</span> <ValueSpan formatted={formatValue(data.semantic_description?.genre?.primary)} />
                    {data.semantic_description?.genre?.primary_subgenres && data.semantic_description.genre.primary_subgenres.length > 0 && (
                        <>, Subgenre: <ValueSpan formatted={formatArray(data.semantic_description.genre.primary_subgenres)} /></>
                    )}
                </div>

                {/* Separator */}
                <div className="border-t border-gray-700/50 my-2"></div>

                {/* Semantic Attributes */}
                <div>
                    <span className="text-blue-400">Mood:</span> <ValueSpan formatted={formatArray(data.semantic_description?.attributes?.mood)} />
                </div>
                <div>
                    <span className="text-blue-400">Energy:</span> <ValueSpan formatted={formatArray(data.semantic_description?.attributes?.energy)} />
                </div>
                <div>
                    <span className="text-blue-400">Texture:</span> <ValueSpan formatted={formatArray(data.semantic_description?.attributes?.texture)} />
                </div>

                {/* Separator */}
                <div className="border-t border-gray-700/50 my-2"></div>

                {/* Featured Instruments */}
                {data.semantic_description?.instrumentation && data.semantic_description.instrumentation.length > 0 && (
                    <>
                        {data.semantic_description.instrumentation.map((inst: any, idx: number) => (
                            <div key={idx}>
                                <div><span className="text-blue-400">Featured Instrument {idx + 1}:</span> <ValueSpan formatted={formatValue(inst.instrument)} /></div>
                                <div className="ml-4"><span className="text-blue-400">Role:</span> <ValueSpan formatted={formatValue(inst.role)} /></div>
                                <div className="ml-4"><span className="text-blue-400">Instrument Descriptors:</span> <ValueSpan formatted={formatArray(inst.descriptors)} /></div>
                            </div>
                        ))}
                    </>
                )}

                {/* Separator */}
                {data.semantic_description?.instrumentation && data.semantic_description.instrumentation.length > 0 && (
                    <div className="border-t border-gray-700/50 my-2"></div>
                )}

                {/* Vocals */}
                {data.semantic_description?.vocals && (
                    <div>
                        <div><span className="text-blue-400">Vocals:</span> <ValueSpan formatted={formatValue(data.semantic_description.vocals.presence)} /></div>
                        <div className="ml-4"><span className="text-blue-400">Gender:</span> <ValueSpan formatted={formatValue(data.semantic_description.vocals.gender)} /></div>
                        <div className="ml-4"><span className="text-blue-400">Style:</span> <ValueSpan formatted={formatValue(data.semantic_description.vocals.style)} /></div>
                        <div className="ml-4"><span className="text-blue-400">Vocal Descriptors:</span> <ValueSpan formatted={formatArray(data.semantic_description.vocals.descriptors)} /></div>
                    </div>
                )}

                {/* Separator */}
                {data.semantic_description?.vocals && (
                    <div className="border-t border-gray-700/50 my-2"></div>
                )}

                {/* Music Theory */}
                {data.theory && (
                    <div className="mt-3">
                        <div className="text-blue-400">Music Theory:</div>
                        <div className="ml-2">{'{'}</div>
                        <div className="ml-4">BPM: <ValueSpan formatted={formatValue(data.theory.bpm)} /></div>
                        <div className="ml-4">Key: <ValueSpan formatted={formatValue(data.theory.key)} />, Scale: <ValueSpan formatted={formatValue(data.theory.scale)} /></div>
                        <div className="ml-4">Chords: <ValueSpan formatted={formatValue(data.theory.chords)} /></div>
                        <div className="ml-2">{'}'}</div>
                    </div>
                )}

                </div>
            </div>
        </div>
    );
});

HumanReadablePreview.displayName = 'HumanReadablePreview';
