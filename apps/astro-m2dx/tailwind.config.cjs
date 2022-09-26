/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            screens: {
                xs: '360px',
                sm: '480px',
                md: '640px',
                lg: '768px',
                xl: '1024px',
                '2xl': '1280px',
                '3xl': '1536px',
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
