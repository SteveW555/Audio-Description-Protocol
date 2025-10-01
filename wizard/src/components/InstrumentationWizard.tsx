import React from 'react';
import { AskStep } from './AskStep';
import { TermSelector } from './TermSelector';
import { useInstrumentationFlow } from '../hooks/useInstrumentationFlow';
import { InstrumentationEntry } from '../types/protocol';

interface InstrumentationWizardProps {
    stepNumber: number;
    onNext: () => void;
}

export const InstrumentationWizard = ({ stepNumber, onNext }: InstrumentationWizardProps) => {
    const {
        instrumentStep,
        setInstrumentStep,
        currentInstrumentIndex,
        currentInstrument,
        instrumentation,
        addInstrument,
        updateInstrumentField,
        descriptorOptions,
        roleOptions,
        instrumentOptions,
    } = useInstrumentationFlow();

    if (instrumentStep === 0) {
        const promptText = instrumentation.length > 0
            ? 'Would you like to add more instrument details?'
            : 'Would you like to add some instrument details?';

        return (
            <AskStep
                title={`Step ${stepNumber}: Instrumentation`}
                prompt={promptText}
                onYes={addInstrument}
                onNo={onNext}
            />
        );
    }

    if (instrumentStep === 1) {
        return (
            <div className="p-1">
                <h3 className="font-semibold text-lg mb-2 dark:text-gray-200">Adding Instrument #{currentInstrumentIndex + 1}: Name</h3>
                <TermSelector
                    terms={instrumentOptions}
                    selected={currentInstrument.instrument}
                    onSelect={(value: string | string[]) =>
                        updateInstrumentField('instrument', value as InstrumentationEntry['instrument'])
                    }
                    onNext={() => setInstrumentStep(2)}
                    onSkip={() => {
                        updateInstrumentField('instrument', 'tbc');
                        setInstrumentStep(2);
                    }}
                />
            </div>
        );
    }

    if (instrumentStep === 2) {
        return (
            <div className="p-1">
                <h3 className="font-semibold text-lg mb-2 dark:text-gray-200">Adding Instrument #{currentInstrumentIndex + 1}: Role</h3>
                <TermSelector
                    terms={roleOptions}
                    selected={currentInstrument.role}
                    onSelect={(value: string | string[]) =>
                        updateInstrumentField('role', value as InstrumentationEntry['role'])
                    }
                    onNext={() => setInstrumentStep(3)}
                    onSkip={() => {
                        updateInstrumentField('role', 'tbc');
                        setInstrumentStep(3);
                    }}
                />
            </div>
        );
    }

    if (instrumentStep === 3) {
        return (
            <div className="p-1">
                <h3 className="font-semibold text-lg mb-2 dark:text-gray-200">Adding Instrument #{currentInstrumentIndex + 1}: Descriptors</h3>
                <TermSelector
                    terms={descriptorOptions}
                    selected={currentInstrument.descriptors}
                    multi
                    onSelect={(value: string | string[]) =>
                        updateInstrumentField('descriptors', value as InstrumentationEntry['descriptors'])
                    }
                    onNext={() => setInstrumentStep(0)}
                    onSkip={() => {
                        updateInstrumentField('descriptors', ['tbc']);
                        setInstrumentStep(0);
                    }}
                />
            </div>
        );
    }

    return null;
};
