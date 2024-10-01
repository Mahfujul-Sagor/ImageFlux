import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export function useThemeColor({ light, dark }, colorName) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = theme === 'dark' ? dark : light;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
