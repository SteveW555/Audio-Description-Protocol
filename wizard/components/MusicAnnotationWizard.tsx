import { WizardProvider } from '../src/context/WizardContext';
import { WizardLayout } from '../src/components/WizardLayout';

const MusicAnnotationWizard: React.FC = () => {
    return (
        <WizardProvider>
            <WizardLayout />
        </WizardProvider>
    );
}

export default MusicAnnotationWizard