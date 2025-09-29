import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { WizardProvider } from './context/WizardContext';
import { WizardLayout } from './components/WizardLayout';

function App() {
    return (
        <ThemeProvider>
            <WizardProvider>
                <WizardLayout />
            </WizardProvider>
        </ThemeProvider>
    );
}

export default App;
