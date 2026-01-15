/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand': {
                    'orange': '#f97316',
                    'blue': '#2563eb',
                    'teal': '#14b8a6',
                    'cream': '#F8F6F3',
                    'beige': '#F5F1EB',
                    'text': '#2C2C2C',
                    'dark': '#1A1A1A',
                    'light': '#FAFAFA',
                }
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif'],
                'serif': ['Playfair Display', 'serif'],
            },
        },
    },
    plugins: [],
}
