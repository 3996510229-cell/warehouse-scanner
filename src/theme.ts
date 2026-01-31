import {MD2LightTheme as lightTheme, configureFonts} from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
  weights: {
    normal: '400' as const,
    bold: '700' as const,
  },
  sizes: {
    caption: 12,
    label: 14,
    body: 16,
    headline: 20,
    title: 24,
  },
};

export const theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#1976D2',
    accent: '#FF5722',
    background: '#f5f5f5',
    surface: '#ffffff',
    error: '#f44336',
    text: '#333333',
    disabled: '#9e9e9e',
    placeholder: '#999999',
  },
  fonts: configureFonts({config: fontConfig}),
};
