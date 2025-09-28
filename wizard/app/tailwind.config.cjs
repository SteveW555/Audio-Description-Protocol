/*****************************************
 * Tailwind CSS configuration for Audio Protocol Wizard
 *****************************************/
module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            },
        },
    },
    plugins: [],
};
