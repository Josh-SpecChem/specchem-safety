import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SpecChem Design System Colors - Updated Palette
        'bg-base': '#F5F0F6', // Magnolia
        'bg-elev1': '#FFFFFF',
        'bg-elev2': '#F5F5F7',
        'fg-primary': '#020747', // Federal blue
        'fg-secondary': '#013A81', // Yale blue
        'fg-muted': '#8D8A88', // Battleship gray
        'brand-primary': '#DEB408', // Gold (metallic) - replacing orange
        'brand-primary-600': '#C4A007', // Darker gold for hover states
        'accent-cool': '#013A81', // Yale blue
        'state-success': '#16A34A',
        'state-warning': '#DEB408', // Gold
        'state-error': '#DC2626',
        // Additional palette colors
        'yale-blue': '#013A81',
        'gold': '#DEB408', 
        'federal-blue': '#020747',
        'battleship-gray': '#8D8A88',
        'magnolia': '#F5F0F6',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'serif': ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
