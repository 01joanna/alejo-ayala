/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Helvetica', 'Arial', 'sans-serif'],
                trade: ['Trade Gothic', 'sans-serif'],
                ablation: ['Ablation', 'sans-serif'],
                helvetica: ['Helvetica', 'sans-serif'],
                helveticaBold: ['Helvetica Bold', 'sans-serif'],
                helveticaLight: ['Helvetica Light', 'sans-serif'],
                helveticaBlack: ['Helvetica Black', 'sans-serif'],
                helveticaThin: ['Helvetica Thin', 'sans-serif'],

            },
        },
    },
    plugins: [],
};