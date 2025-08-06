import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type Theme = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  accent: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  overlayLight: string;
  surfaceSecondary: string;
  success: string;
  warning: string;
  error: string;
  shadow: string;
}

const lightTheme: ThemeColors = {
  primary: '#0A0A0A',         // Very dark gray (almost black)
  background: '#F5F5F7',      // Light warm gray
  surface: '#FFFFFF',         // Pure white
  accent: '#2EB516',         // Vibrant green
  text: '#0A0A0A',           // Very dark gray (same as primary)
  textSecondary: '#6B7280',  // Medium cool gray
  textTertiary: '#9ea5b0ff',   // Light gray for tertiary text
  border: '#E5E7EB',         // Light border color
  overlayLight: 'rgba(255, 255, 255, 0.8)', // Semi-transparent overlay
  surfaceSecondary: '#F9FAFB', // Secondary surface color
  mutedGold: '#D4A017',      // Soft, elegant gold
  deepNavy: '#1E3A8A',       // Rich navy blue
  softBlush: '#FCE7E9',      // Delicate pink
  charcoal: '#374151',       // Dark cool gray
  ivory: '#FAF9F6',          // Creamy off-white
  success: '#10B981',        // Success green
  warning: '#F59E0B',        // Warning orange
  error: '#EF4444',          // Error red
  shadow: '#000000',         // Shadow color
};

const darkTheme: ThemeColors = {
  primary: '#FFFFFF',
  background: '#121212',
  surface: '#1E1E1E',
  accent: '#2EB516',
  text: '#E5E5E5',
  textSecondary: '#A1A1AA',
  textTertiary: '#babab5',
  border: '#2A2A2A',
  overlayLight: 'rgba(0, 0, 0, 0.8)',
  surfaceSecondary: '#2A2A2A',
  mutedGold: '#E6B84D',      // Brighter, warmer gold for visibility on dark backgrounds
  deepNavy: '#1E3A8A',       // Lighter, vibrant navy for better contrast
  softBlush: '#F4A7B0',      // Slightly more saturated pink for dark mode visibility
  charcoal: '#6B7280',       // Medium cool gray (reused from light theme for consistency)
  ivory: '#E5E5E3',          // Slightly darker off-white for subtle accents
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  shadow: '#000000',
};

interface Typography {
  h1: { fontSize: number; fontWeight: 'bold' };
  h2: { fontSize: number; fontWeight: 'bold' };
  h3: { fontSize: number; fontWeight: 'bold' };
  body: { fontSize: number; fontWeight: 'normal' };
  caption: { fontSize: number; fontWeight: 'normal' };
}

const typography: Typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: 'bold' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 12, fontWeight: 'normal' },
};

interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const storeTheme = async (theme: Theme) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem('app_theme', theme);
    } else {
      await SecureStore.setItemAsync('app_theme', theme);
    }
  } catch (error) {
    console.warn('Failed to store theme:', error);
  }
};

const getStoredTheme = async (): Promise<Theme | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem('app_theme') as Theme | null;
    } else {
      return await SecureStore.getItemAsync('app_theme') as Theme | null;
    }
  } catch (error) {
    console.warn('Failed to get stored theme:', error);
    return null;
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await getStoredTheme();
      if (storedTheme) {
        setThemeState(storedTheme);
      }
    };
    loadTheme();
  }, []);

  const colors = theme === 'light' ? lightTheme : darkTheme;

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await storeTheme(newTheme);
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, typography, spacing, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
