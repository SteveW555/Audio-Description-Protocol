import { useCallback, useMemo } from 'react';

import { useWizardStore } from '../context/WizardContext';
import { StepType, WizardStepConfig } from '../types/wizard';
import { useWizardSteps } from './useWizardSteps';

const findNextStepIndex = (steps: WizardStepConfig[], currentIndex: number): number => {
    let next = currentIndex + 1;
    while (next < steps.length && steps[next].condition && !steps[next].condition?.()) {
        next += 1;
    }
    return next;
};

const findPreviousStepIndex = (steps: WizardStepConfig[], currentIndex: number): number => {
    let previous = currentIndex - 1;
    while (previous >= 0 && steps[previous].condition && !steps[previous].condition?.()) {
        previous -= 1;
    }
    return previous;
};

const computeStepNumber = (steps: WizardStepConfig[], currentIndex: number): number => {
    return steps
        .slice(0, currentIndex + 1)
        .filter((step) => !step.condition || step.condition())
        .length;
};

export const useWizardNavigation = () => {
    const steps = useWizardSteps();
    const step = useWizardStore((state) => state.step);
    const setStep = useWizardStore((state) => state.setStep);
    const reset = useWizardStore((state) => state.reset);

    const currentStepConfig = steps[step];

    const goToNextStep = useCallback(() => {
        const nextIndex = findNextStepIndex(steps, step);
        setStep(nextIndex);
    }, [setStep, step, steps]);

    const goToPreviousStep = useCallback(() => {
        const previousIndex = findPreviousStepIndex(steps, step);
        setStep(previousIndex < 0 ? 0 : previousIndex);
    }, [setStep, step, steps]);

    const stepNumber = useMemo(() => computeStepNumber(steps, step), [steps, step]);

    const isFinalStep = currentStepConfig?.special === StepType.FINAL || step >= steps.length;

    return {
        steps,
        step,
        stepNumber,
        currentStepConfig,
        isFinalStep,
        goToNextStep,
        goToPreviousStep,
        reset,
    };
};
