/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--bg)',
                surface: 'var(--surface)',
                card: 'var(--card)',
                text: 'var(--text)',
                muted: 'var(--muted)',
                border: 'var(--border)',
                pastel: {
                    blue: 'var(--pastel-blue)',
                    pink: 'var(--pastel-pink)',
                    green: 'var(--pastel-green)',
                    yellow: 'var(--pastel-yellow)',
                    purple: 'var(--pastel-purple)',
                }
            },
            fontFamily: {
                sans: 'var(--font-family-sans)',
            },
            borderRadius: {
                lg: 'var(--border-radius-lg)',
                md: 'var(--border-radius-md)',
                sm: 'var(--border-radius-sm)',
            }
        },
    },
    plugins: [],
}
