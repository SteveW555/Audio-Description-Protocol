import { memo, useMemo } from 'react';

import { useWizardStore } from '../context/WizardContext';
import { highlightJsonString } from '../utils/jsonHighlight';

export const JsonPreview = memo(() => {
    const data = useWizardStore((state) => state.data);

    const highlightedJson = useMemo(() => highlightJsonString(data), [data]);

    return (
        <div className="h-full bg-gray-900 rounded-lg p-4 overflow-auto">
            <pre
                className="text-[11px] text-gray-300 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: highlightedJson }}
            />
        </div>
    );
});

JsonPreview.displayName = 'JsonPreview';
