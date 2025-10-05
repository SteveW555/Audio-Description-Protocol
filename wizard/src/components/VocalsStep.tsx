import React, { useMemo } from 'react';
import { TermSelector } from './TermSelector';
import { VOCABULARY } from '../constants/vocabulary';
import { useWizardStore } from '../context/WizardContext';
import { generateRandomVocals } from '../utils/randomMET';

interface VocalsStepProps {
    stepNumber: number;
    title: string;
    onNext: () => void;
}

export const VocalsStep = ({ stepNumber, title, onNext }: VocalsStepProps) => {
    const presence = useWizardStore(
        (state) => state.data.semantic_description.vocals.presence,
    );
    const gender = useWizardStore(
        (state) => state.data.semantic_description.vocals.gender,
    );
    const style = useWizardStore(
        (state) => state.data.semantic_description.vocals.style,
    );
    const descriptors = useWizardStore(
        (state) => state.data.semantic_description.vocals.descriptors,
    );
    const updateData = useWizardStore((state) => state.updateData);

    const presenceOptions = useMemo(() => [...VOCABULARY.vocals_presence], []);
    const genderOptions = useMemo(() => [...VOCABULARY.vocals_gender], []);
    const styleOptions = useMemo(() => [...VOCABULARY.vocals_style], []);
    const descriptorOptions = useMemo(
        () => [...(VOCABULARY.instrument_descriptors['vocals'] ?? [])],
        [],
    );

    const normalizedPresence = presence as string | undefined;
    const hasPresenceSelection = Boolean(
        normalizedPresence && normalizedPresence !== 'tbc',
    );
    // Always show details sections - let user fill them in
    const showDetails = true;

    const handlePresenceSelect = (value: string | string[]) => {
        const nextPresence = Array.isArray(value) ? value[0] : value;
        updateData('semantic_description.vocals.presence', nextPresence);

        // If 'none' is selected, clear other fields
        if (nextPresence === 'none') {
            updateData('semantic_description.vocals.gender', 'tbc');
            updateData('semantic_description.vocals.style', 'tbc');
            updateData('semantic_description.vocals.descriptors', ['tbc']);
        }
    };

    const handleGenderSelect = (value: string | string[]) => {
        const nextGender = Array.isArray(value) ? value[0] : value;
        updateData('semantic_description.vocals.gender', nextGender);
    };

    const handleStyleSelect = (value: string | string[]) => {
        const nextStyle = Array.isArray(value) ? value[0] : value;
        updateData('semantic_description.vocals.style', nextStyle);
    };

    const handleDescriptorsSelect = (value: string | string[]) => {
        const values = Array.isArray(value) ? value : [value];
        const cleaned = values.filter(Boolean);
        const normalized =
            cleaned.length > 1
                ? cleaned.filter((entry) => entry !== 'tbc')
                : cleaned;
        updateData('semantic_description.vocals.descriptors', normalized);
    };

    const markPresenceUnknown = () => {
        updateData('semantic_description.vocals.presence', 'tbc');
    };

    const markGenderUnknown = () => {
        updateData('semantic_description.vocals.gender', 'tbc');
    };

    const markStyleUnknown = () => {
        updateData('semantic_description.vocals.style', 'tbc');
    };

    const markDescriptorsUnknown = () => {
        updateData('semantic_description.vocals.descriptors', ['tbc']);
    };

    const handleContinue = () => {
        const resolvedPresence = presence || 'tbc';
        updateData('semantic_description.vocals.presence', resolvedPresence);

        if (resolvedPresence === 'none') {
            updateData('semantic_description.vocals.gender', 'tbc');
            updateData('semantic_description.vocals.style', 'tbc');
            updateData('semantic_description.vocals.descriptors', ['tbc']);
        } else {
            const resolvedGender = gender || 'tbc';
            const resolvedStyle = style || 'tbc';
            const resolvedDescriptors =
                descriptors && descriptors.length > 0 ? descriptors : ['tbc'];

            updateData('semantic_description.vocals.gender', resolvedGender);
            updateData('semantic_description.vocals.style', resolvedStyle);
            updateData('semantic_description.vocals.descriptors', resolvedDescriptors);
        }

        onNext();
    };

    const handleRandomize = () => {
        const randomVocals = generateRandomVocals();

        if (randomVocals) {
            updateData('semantic_description.vocals.presence', randomVocals.presence);
            updateData('semantic_description.vocals.gender', randomVocals.gender);
            updateData('semantic_description.vocals.style', randomVocals.style);
            updateData('semantic_description.vocals.descriptors', randomVocals.descriptors);
        } else {
            // 50% chance - set to none
            updateData('semantic_description.vocals.presence', 'none');
            updateData('semantic_description.vocals.gender', 'tbc');
            updateData('semantic_description.vocals.style', 'tbc');
            updateData('semantic_description.vocals.descriptors', ['tbc']);
        }

        onNext();
    };

    const isContinueDisabled =
        !normalizedPresence || normalizedPresence === 'tbc';

    return (
        <div className="p-1 space-y-4">
            <div>
                <h2 className="text-base font-bold text-gray-800 dark:text-white">
                    Step {stepNumber}: {title}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Select vocal presence first, then add gender, style, and descriptors.
                </p>
            </div>

            {/* Vocal Presence */}
            <section className="space-y-1">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Vocal Presence
                </h3>
                <TermSelector
                    terms={presenceOptions}
                    selected={presence}
                    onSelect={handlePresenceSelect}
                    onNext={() => {}}
                    onSkip={markPresenceUnknown}
                    controlsLayout="none"
                    compactMode={true}
                />
                {isContinueDisabled && (
                    <p className="text-xs mt-1" style={{ color: '#D87710' }}>
                        Choose a vocal presence option
                    </p>
                )}
            </section>

            {/* Vocal Details (shown only if presence is not 'none') */}
            {showDetails && (
                <>
                    <section className="space-y-1">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Vocal Gender
                        </h3>
                        <TermSelector
                            terms={genderOptions}
                            selected={gender || undefined}
                            onSelect={handleGenderSelect}
                            onNext={() => {}}
                            onSkip={markGenderUnknown}
                            controlsLayout="none"
                            compactMode={true}
                        />
                    </section>

                    <section className="space-y-1">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Vocal Style
                        </h3>
                        <TermSelector
                            terms={styleOptions}
                            selected={style || undefined}
                            onSelect={handleStyleSelect}
                            onNext={() => {}}
                            onSkip={markStyleUnknown}
                            controlsLayout="none"
                            compactMode={true}
                        />
                    </section>

                    <section className="space-y-1">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Vocal Descriptors
                        </h3>
                        <TermSelector
                            terms={descriptorOptions}
                            selected={descriptors}
                            multi
                            onSelect={handleDescriptorsSelect}
                            onNext={() => {}}
                            onSkip={markDescriptorsUnknown}
                            controlsLayout="none"
                            compactMode={true}
                        />
                    </section>
                </>
            )}

            {/* Action Buttons */}
            <div className="relative flex flex-col-reverse items-center gap-3 pt-2 sm:flex-row sm:justify-center scale-[0.7] origin-center">
                <button
                    type="button"
                    onClick={() => {
                        updateData('semantic_description.vocals.presence', 'tbc');
                        updateData('semantic_description.vocals.gender', 'tbc');
                        updateData('semantic_description.vocals.style', 'tbc');
                        updateData('semantic_description.vocals.descriptors', ['tbc']);
                        onNext();
                    }}
                    className="px-4 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-slate-700/40 rounded-lg hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-600/50 transition-colors"
                >
                    Skip
                </button>
                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={isContinueDisabled}
                    className="px-5 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save &amp; Continue
                </button>
                <button
                    type="button"
                    onClick={handleRandomize}
                    className="absolute left-[90%] px-3 py-0.5 text-xs font-semibold whitespace-nowrap text-white bg-cyan-600/70 rounded shadow-sm hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-cyan-500 dark:focus:ring-offset-slate-900"
                >
                    Random Vocals
                </button>
            </div>
        </div>
    );
};

VocalsStep.displayName = 'VocalsStep';
