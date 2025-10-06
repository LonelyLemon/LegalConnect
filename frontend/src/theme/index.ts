import type { StyleProp } from 'react-native';
import { colors as lightColors } from './light';
import { colors as darkColors } from './dark';
import { fontSizes, spacing } from './spacing';

export type ThemeContexts = 'light' | 'dark';
export type Colors = typeof lightColors | typeof darkColors;
export type Spacing = typeof spacing;
export type FontSizes = typeof fontSizes;

export interface Theme {
  colors: Colors;
  spacing: Spacing;
  theme: ThemeContexts;
  fontSizes: FontSizes;
}

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  theme: 'light',
  fontSizes,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  theme: 'dark',
  fontSizes,
};

export type ThemedStyle<T> = (theme: Theme) => T;
export type ThemedStyleArray<T> = (
  | ThemedStyle<T>
  | StyleProp<T>
  | (StyleProp<T> | ThemedStyle<T>)[]
)[];

export { lightColors as colors };
export { darkColors };

export * from './styles';
