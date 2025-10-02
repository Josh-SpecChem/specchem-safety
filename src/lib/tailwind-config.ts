import type { Config } from 'tailwindcss';

/**
 * Tailwind CSS Configuration - Decoupled from centralized config
 * This file provides Tailwind-specific configuration without depending on environment variables
 * to avoid circular dependencies and loading issues with Tailwind CSS IntelliSense
 */

export const getTailwindConfig = (): Config => {
  // Use process.env directly for NODE_ENV to avoid circular dependency
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
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
          // Standard Tailwind colors for compatibility
          primary: {
            50: '#eff6ff',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
          },
          secondary: {
            50: '#f8fafc',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
          },
        },
        
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui'],
          serif: ['Merriweather', 'Georgia', 'serif'],
        },
        
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
        },
      },
    },
    
    plugins: [],
    
    // Development-specific configuration
    ...(isDevelopment && {
      safelist: [
        'bg-red-100',
        'bg-green-100',
        'bg-blue-100',
        'bg-yellow-100',
      ],
    }),
  };
};

// Export the configuration for use in tailwind.config.ts
export default getTailwindConfig();
