/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class", // Enables dark mode via a CSS class
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			animation: {
				"gradient-x": "gradient-x 4s ease infinite",
				"shimmer": "shimmer 2s forwards",
				float: "float 3s ease-in-out infinite",
				twinkle: "twinkle 4s ease-in-out infinite",
				"twinkle-delay": "twinkle-delay 4s ease-in-out infinite",
				"fade-in": "fade-in 0.6s ease-out",
			},
			keyframes: {
				"gradient-x": {
					"0%, 100%": {backgroundPosition: "0% 50%"},
					"50%": {backgroundPosition: "100% 50%"},
				},
				"shimmer": {
					"100%": {transform: "translateX(100%)"},
				},
				float: {
					"0%, 100%": {transform: "translateY(0)"},
					"50%": {transform: "translateY(-10px)"},
				},
				twinkle: {
					"0%, 100%": {opacity: 1},
					"50%": {opacity: 0.3},
				},
				"twinkle-delay": {
					"0%, 100%": {opacity: 0.4},
					"50%": {opacity: 1},
				},
				"fade-in": {
					"0%": {opacity: 0, transform: "translateY(10px)"},
					"100%": {opacity: 1, transform: "translateY(0)"},
				},
			},
		},
	},
	plugins: [],
};
