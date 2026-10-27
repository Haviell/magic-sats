import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			montserrat: ['var(--font-montserrat)'],
  			sans: ['var(--font-montserrat)'],
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			'neobrutalism': '6px 8px 0px 0px rgba(0, 0, 0, 1)',
  		},
  		keyframes: {
  			ripple: {
  				'0%': { transform: 'scale(0.8)', opacity: '0.5' },
  				'100%': { transform: 'scale(2)', opacity: '0' },
  			},
  			shine: {
  				'0%': { transform: 'translateX(-200%)' },
  				'100%': { transform: 'translateX(200%)' },
  			},
  			pulse: {
  				'0%, 100%': { opacity: '0.2' },
  				'50%': { opacity: '0.5' },
  			},
  			glowIntense: {
  				'0%, 100%': { boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)' },
  				'50%': { boxShadow: '0 0 16px rgba(255, 255, 255, 1)' },
  			},
  		},
  		animation: {
  			ripple: 'ripple 0.6s linear',
  			shine: 'shine 1.5s ease-in-out infinite',
  			pulse: 'pulse 2s infinite',
  			glowIntense: 'glowIntense 2s ease-in-out infinite',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
