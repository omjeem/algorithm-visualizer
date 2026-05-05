/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020617',
          900: '#0a1628',
          800: '#0f1f3d',
          700: '#162952',
          600: '#1e3a5f',
        },
        neon: {
          blue: '#0ea5e9',
          purple: '#a855f7',
          cyan: '#06b6d4',
          green: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-blue': 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
        'glow-purple': 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(14,165,233,0.4), 0 0 40px rgba(14,165,233,0.2)',
        'glow-purple': '0 0 20px rgba(168,85,247,0.4), 0 0 40px rgba(168,85,247,0.2)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'dash': 'dash 1s linear infinite',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 10px rgba(14,165,233,0.3)' },
          to: { boxShadow: '0 0 30px rgba(14,165,233,0.8), 0 0 60px rgba(14,165,233,0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        dash: {
          to: { strokeDashoffset: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
