export const highlightJsonString = (data: unknown): string => {
    const jsonString = JSON.stringify(data, null, 2);
    return jsonString
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, (match) => {
            let cls = 'text-green-400';
            if (/:$/.test(match)) {
                cls = 'text-purple-400';
            }
            return `<span class="${cls}">${match}</span>`;
        })
        .replace(/(true|false)/g, '<span class="text-yellow-400">$1</span>')
        .replace(/([0-9]+(\.[0-9]+)?)/g, '<span class="text-cyan-400">$1</span>')
        .replace(/(null)/g, '<span class="text-red-400">$1</span>');
};
