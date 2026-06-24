import React, { createContext, useContext } from 'react';
import { ThemeType, ThemeColors } from './types';
import { useCartStore } from './store';

interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useCartStore((state) => state.theme);
  const colors = useCartStore((state) => state.colors);

  return (
    <ThemeContext.Provider value={{ theme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
