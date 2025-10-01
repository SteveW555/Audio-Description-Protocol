const isCompletedValue = (value: string): boolean => {
    // Remove quotes and check if it's not "tbc", empty, or null
    const cleanValue = value.replace(/^"|"$/g, '');
    return cleanValue !== 'tbc' && cleanValue !== '' && cleanValue !== 'null';
};

export const highlightJsonString = (data: unknown): string => {
    const jsonString = JSON.stringify(data, null, 2);
    return jsonString
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, (match) => {
            let cls = 'text-green-400';
            if (/:$/.test(match)) {
                // Keys are purple
                cls = 'text-purple-400';
            } else if (isCompletedValue(match)) {
                // Completed values are green
                cls = 'text-green-400';
            } else {
                // Incomplete values (tbc, empty) are gray
                cls = 'text-gray-400';
            }
            return `<span class="${cls}">${match}</span>`;
        })
        .replace(/(true|false)/g, '<span class="text-yellow-400">$1</span>')
        .replace(/([0-9]+(\.[0-9]+)?)/g, '<span class="text-cyan-400">$1</span>')
        .replace(/(null)/g, '<span class="text-red-400">$1</span>');
};
