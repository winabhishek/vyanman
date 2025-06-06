
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				heading: ['Poppins', 'sans-serif']
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				vyanman: {
					50: 'hsl(var(--vyanman-50))',
					100: 'hsl(var(--vyanman-100))', 
					200: 'hsl(var(--vyanman-200))',
					300: 'hsl(var(--vyanman-300))',
					400: 'hsl(var(--vyanman-400))',
					500: 'hsl(var(--vyanman-500))', // Main brand color - Gold
					600: 'hsl(var(--vyanman-600))',
					700: 'hsl(var(--vyanman-700))',
					800: 'hsl(var(--vyanman-800))',
					900: 'hsl(var(--vyanman-900))',
					950: 'hsl(var(--vyanman-950))',
				},
				vyanamana: {
					50: 'hsl(var(--vyanamana-50))',
					100: 'hsl(var(--vyanamana-100))',
					200: 'hsl(var(--vyanamana-200))',
					300: 'hsl(var(--vyanamana-300))',
					400: 'hsl(var(--vyanamana-400))',
					500: 'hsl(var(--vyanamana-500))',
					600: 'hsl(var(--vyanamana-600))',
					700: 'hsl(var(--vyanamana-700))',
					800: 'hsl(var(--vyanamana-800))',
					900: 'hsl(var(--vyanamana-900))',
					950: 'hsl(var(--vyanamana-950))',
				},
				amber: {
					DEFAULT: '#FFB800',
					50: '#FFF6E0',
					100: '#FFEFC7',
					200: '#FFE195',
					300: '#FFD363',
					400: '#FFC531',
					500: '#FFB800',
					600: '#CC9300',
					700: '#996E00',
					800: '#664A00',
					900: '#332500',
					950: '#1A1300',
				},
				burgundy: {
					DEFAULT: '#5D1D29',
					50: '#EFCAD0',
					100: '#E8B5BE',
					200: '#D88A9B',
					300: '#C86078',
					400: '#B83654',
					500: '#971C39',
					600: '#7D1A32',
					700: '#62182A',
					800: '#5D1D29',
					900: '#471622',
					950: '#2F0F17',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'breathe': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'slide-in': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-out': {
					'0%': { transform: 'translateY(0)', opacity: '1' },
					'100%': { transform: 'translateY(20px)', opacity: '0' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(255, 184, 0, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(255, 184, 0, 0.8)' }
				},
				'typing': {
					'0%': { width: '0%' },
					'100%': { width: '100%' }
				},
				'blink-caret': {
					'0%, 100%': { borderColor: 'transparent' },
					'50%': { borderColor: 'hsl(var(--vyanman-500))' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' }
				},
				'rotate-3d': {
					'0%': { transform: 'perspective(1000px) rotateY(0deg)' },
					'100%': { transform: 'perspective(1000px) rotateY(360deg)' }
				},
				'ripple': {
					'0%': { transform: 'scale(0)', opacity: '0.5' },
					'100%': { transform: 'scale(4)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'breathe': 'breathe 6s ease-in-out infinite',
				'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
				'slide-in': 'slide-in 0.3s ease-out',
				'slide-out': 'slide-out 0.3s ease-out',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'typing': 'typing 3.5s steps(40, end)',
				'blink-caret': 'blink-caret 0.75s step-end infinite',
				'shimmer': 'shimmer 2s infinite linear',
				'rotate-3d': 'rotate-3d 20s linear infinite',
				'ripple': 'ripple 1s ease-out'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
				'gradient-premium': 'linear-gradient(135deg, #FFB800 0%, #FF8A00 100%)',
				'gradient-user-bubble': 'linear-gradient(135deg, #FFB800 0%, #FFD700 100%)',
				'gradient-bot-bubble': 'linear-gradient(135deg, #EDF2F7 0%, #E2E8F0 100%)',
				'gradient-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
				'gradient-primary': 'linear-gradient(135deg, #FFB800 0%, #FFC700 100%)',
				'gradient-accent': 'linear-gradient(135deg, #5D1D29 0%, #7D1A32 100%)',
				'vyanman-gradient': 'linear-gradient(135deg, #5D1D29 0%, #7D1A32 100%)',
			},
			boxShadow: {
				'premium': '0 4px 20px -2px rgba(255, 184, 0, 0.2)',
				'glass': '0 8px 32px rgba(31, 38, 135, 0.15)',
				'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
				'glow': '0 0 15px rgba(255, 184, 0, 0.5)',
				'neumorphic': '5px 5px 10px rgba(0, 0, 0, 0.1), -5px -5px 10px rgba(255, 255, 255, 0.8)',
				'neumorphic-dark': '5px 5px 10px rgba(0, 0, 0, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.05)'
			},
			backdropFilter: {
				'glass': 'blur(16px) saturate(180%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
