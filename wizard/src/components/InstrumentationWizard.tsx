import React from 'react';
import { AskStep } from './AskStep';
import { TermSelector } from './TermSelector';
import {
    MAX_NUM_INSTRUMENTS,
    useInstrumentationFlow,
} from '../hooks/useInstrumentationFlow';
import { InstrumentationEntry } from '../types/protocol';
import { RANDOM_BUTTON_COLORS } from '../constants/uiConstants';
import { generateRandomInstrument } from '../utils/randomMET';
interface InstrumentationWizardProps {
    stepNumber: number;
    onNext: () => void;
}
export const InstrumentationWizard = ({
    stepNumber,
    onNext,
}: InstrumentationWizardProps) => {
    const {
        instrumentStep,
        setInstrumentStep,
        currentInstrumentIndex,
        currentInstrument,
        instrumentation,
        addInstrument,
        updateInstrumentField,
        overwriteCurrentInstrument,
        descriptorOptions,
        roleOptions,
        instrumentOptions,
    } = useInstrumentationFlow();
    if (instrumentStep === 0) {
        if (instrumentation.length >= MAX_NUM_INSTRUMENTS) {
            onNext();
            return null;
        }
        const promptText =
            instrumentation.length > 0
                ? 'Would you like to add more instrument details?'
                : 'Would you like to add some instrument details?';
        const handleAddInstrument = () => {
            const added = addInstrument();
            if (!added) {
                onNext();
            }
        };
        return (
            <AskStep
                title={`Step ${stepNumber}: Instrumentation`}
                prompt={promptText}
                onYes={handleAddInstrument}
                onNo={onNext}
            />
        );
    }
    if (instrumentStep === 1) {
        const markInstrumentUnknown = () =>
            updateInstrumentField('instrument', 'tbc');
        const markRoleUnknown = () => updateInstrumentField('role', 'tbc');
        const markDescriptorsUnknown = () =>
            updateInstrumentField('descriptors', ['tbc']);
        const isNameSelected = Boolean(
            currentInstrument.instrument &&
                currentInstrument.instrument !== 'tbc',
        );
        const disableSave = !isNameSelected;
        const handleSaveInstrument = () => {
            const nextInstrument: InstrumentationEntry = {
                instrument: currentInstrument.instrument || 'tbc',
                role: currentInstrument.role || 'tbc',
                descriptors:
                    currentInstrument.descriptors &&
                    currentInstrument.descriptors.length > 0
                        ? [...currentInstrument.descriptors]
                        : ['tbc'],
            };
            overwriteCurrentInstrument(nextInstrument);
            setInstrumentStep(0);
        };

        const handleRandomize = () => {
            const randomInst = generateRandomInstrument();
            const nextInstrument: InstrumentationEntry = {
                instrument: randomInst.instrument,
                role: randomInst.role,
                descriptors: randomInst.descriptors,
            };
            overwriteCurrentInstrument(nextInstrument);
            setInstrumentStep(0);
        };
        return (
            <div className="p-1 space-y-6">
                <div>
                    <h3 className="font-semibold text-lg dark:text-gray-200">
                        Adding Instrument #{currentInstrumentIndex + 1}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Choose the instrument, assign its role, and describe it
                        in one pass.
                    </p>
                </div>
                <section className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Instrument Name
                    </h4>
                    <TermSelector
                        terms={instrumentOptions}
                        selected={currentInstrument.instrument}
                        onSelect={(value: string | string[]) =>
                            updateInstrumentField(
                                'instrument',
                                value as InstrumentationEntry['instrument'],
                            )
                        }
                        onNext={() => {}}
                        onSkip={markInstrumentUnknown}
                        controlsLayout="none"
                    />
                </section>
                <section className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Role
                    </h4>
                    <TermSelector
                        terms={roleOptions}
                        selected={currentInstrument.role}
                        onSelect={(value: string | string[]) =>
                            updateInstrumentField(
                                'role',
                                value as InstrumentationEntry['role'],
                            )
                        }
                        onNext={() => {}}
                        onSkip={markRoleUnknown}
                        controlsLayout="none"
                    />
                </section>
                <section className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Descriptors
                    </h4>
                    <TermSelector
                        terms={descriptorOptions}
                        selected={currentInstrument.descriptors}
                        multi
                        onSelect={(value: string | string[]) =>
                            updateInstrumentField(
                                'descriptors',
                                value as InstrumentationEntry['descriptors'],
                            )
                        }
                        onNext={() => {}}
                        onSkip={markDescriptorsUnknown}
                        controlsLayout="none"
                    />
                </section>
                <div className="relative flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center scale-[0.7] origin-center">
                    {!isNameSelected && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                            Choose an instrument name to enable saving.
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={handleSaveInstrument}
                        disabled={disableSave}
                        className="px-5 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                    >
                        Save Instrument
                    </button>
                    <button
                        type="button"
                        onClick={handleRandomize}
                        className="absolute left-[90%] px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-900"
                        style={{ backgroundColor: RANDOM_BUTTON_COLORS.background }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = RANDOM_BUTTON_COLORS.hover}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = RANDOM_BUTTON_COLORS.background}
                    >
                        Random Instrument
                    </button>
                </div>
            </div>
        );
    }
    return null;
};
