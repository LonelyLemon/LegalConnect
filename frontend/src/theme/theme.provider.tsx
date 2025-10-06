import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, StyleProp } from 'react-native'; // Added StyleSheet
import { ScaledSheet } from 'react-native-size-matters';

import {
  darkTheme,
  lightTheme,
  Theme,
  ThemeContexts,
  ThemedStyle,
  ThemedStyleArray,
} from '.';

interface ThemeContextProps {
  theme: Theme;
  themeType: ThemeContexts;
  setThemeType: (themeType: ThemeContexts) => void;
  themed: <T>(
    styleOrStyleFn: ThemedStyle<T> | StyleProp<T> | ThemedStyleArray<T>,
  ) => T;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider(props: ThemeProviderProps) {
  const { children } = props;
  const colorScheme = Appearance.getColorScheme();
  const [currentThemeType, setCurrentThemeType] = useState<ThemeContexts>(
    colorScheme || 'light',
  );

  const setThemeType = (themeType: ThemeContexts) => {
    setCurrentThemeType(themeType);
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme: newColorScheme }) => {
        if (newColorScheme) {
          setCurrentThemeType(newColorScheme);
        }
      },
    );
    return () => subscription.remove();
  }, []);

  const theme = useMemo(
    // This is the correct theme object
    () => (currentThemeType === 'light' ? lightTheme : darkTheme),
    [currentThemeType],
  );

  const themed = useCallback(
    function <T>(
      styleOrStyleFn: ThemedStyle<T> | StyleProp<T> | ThemedStyleArray<T>,
    ): T {
      const flatStyles = [styleOrStyleFn].flat(3);
      const stylesArray = flatStyles.map(f => {
        if (typeof f === 'function') {
          return (f as ThemedStyle<T>)(theme);
        } else {
          return f;
        }
      });
      // Flatten the array of styles into a single object
      return ScaledSheet.create({
        tempStyleKey: Object.assign({}, ...stylesArray),
      }).tempStyleKey as T;
    },
    [theme],
  );

  return (
    <ThemeContext.Provider
      value={{ theme, themeType: currentThemeType, setThemeType, themed }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useAppTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
