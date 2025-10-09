import { useAppTheme } from '../../../theme/theme.provider';
import Icon from '@react-native-vector-icons/ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
  ColorValue,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import * as styles from './styles';
import { moderateScale } from 'react-native-size-matters';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: HeaderStyleOverride;
  navigation?: string; // route name to navigate when pressing back
}

export interface HeaderStyleOverride {
  header?: ViewStyle;
  title?: TextStyle;
  iconColor?: ColorValue;
}

export default function Header({
  title,
  showBackButton = true,
  leftIcon,
  rightIcon,
  style,
  navigation,
}: HeaderProps) {
  const { theme, themed } = useAppTheme();
  const nav = useNavigation<NavigationProp<any>>();

  return (
    <View style={[themed(styles.header), themed(style?.header)]}>
      {showBackButton ? (
        <Pressable
          onPress={() =>
            navigation ? nav.navigate(navigation as never) : nav.goBack()
          }
        >
          <Icon
            name="arrow-back"
            size={moderateScale(theme.fontSizes.xl)}
            color={style?.iconColor || theme.colors.onSurface}
          />
        </Pressable>
      ) : leftIcon ? (
        leftIcon
      ) : (
        <View style={themed(styles.iconPlaceholder)} />
      )}
      {title && (
        <Text
          style={[themed(styles.title), themed(style?.title)]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      )}
      {rightIcon ? rightIcon : <View style={themed(styles.iconPlaceholder)} />}
    </View>
  );
}
