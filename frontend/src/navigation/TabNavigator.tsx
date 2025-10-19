/* eslint-disable react/no-unstable-nested-components */
import Icon from '@react-native-vector-icons/ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemedStyle } from '../theme';
import React, { useState } from 'react';
import { ViewStyle, TextStyle, Platform, Animated } from 'react-native';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeTabsNames, HomeTabsRoutes, StackScreenRoute } from './routes';
import { useAppTheme } from '../theme/theme.provider';

export default function TabNavigator() {
  const [tick] = useState(0); // Dummy state to force re-render
  const { themed } = useAppTheme();
  const insets = useSafeAreaInsets();

  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      key={tick}
      screenOptions={{
        headerShown: false,
        tabBarStyle: themed($tabBar(insets)),
        tabBarActiveTintColor: themed($tabBarActiveColor),
        tabBarInactiveTintColor: themed($tabBarInactiveColor),
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarIconStyle: themed($tabBarIcon),
        tabBarItemStyle: themed($tabBarItem),
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => (
          <Animated.View style={themed($tabBarBackground)} />
        ),
        tabBarAccessibilityLabel: 'Bottom navigation',
      }}
    >
      {HomeTabsRoutes.map((route: StackScreenRoute) => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              return (
                <AnimatedTabIcon
                  route={route}
                  focused={focused}
                  color={color}
                  size={size}
                />
              );
            },
            tabBarLabel: getTabLabel(route.name),
            headerShown: false,
            tabBarAccessibilityLabel: getTabAccessibilityLabel(route.name),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

function AnimatedTabIcon({
  route,
  focused,
  color,
  size,
}: {
  route: StackScreenRoute;
  focused: boolean;
  color: string;
  size: number;
}) {
  const scaleValue = React.useRef(
    new Animated.Value(focused ? 1.1 : 1),
  ).current;
  const opacityValue = React.useRef(
    new Animated.Value(focused ? 1 : 0.7),
  ).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: focused ? 1.1 : 1,
        useNativeDriver: true,
        tension: 150,
        friction: 15,
      }),
      Animated.spring(opacityValue, {
        toValue: focused ? 1 : 0.7,
        useNativeDriver: true,
        tension: 150,
        friction: 15,
      }),
    ]).start();
  }, [focused, scaleValue, opacityValue]);

  let iconName: any = 'home';

  if (route.name === HomeTabsNames.Home) {
    iconName = focused ? 'home' : 'home-outline';
  } else if (route.name === HomeTabsNames.Cases) {
    iconName = focused ? 'document-text' : 'document-text-outline';
  } else if (route.name === HomeTabsNames.Messages) {
    iconName = focused ? 'chatbubble' : 'chatbubble-outline';
  } else if (route.name === HomeTabsNames.Documents) {
    iconName = focused ? 'book' : 'book-outline';
  } else if (route.name === HomeTabsNames.Setting) {
    iconName = focused ? 'settings' : 'settings-outline';
  }

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleValue }],
        opacity: opacityValue,
      }}
    >
      <Icon name={iconName} size={moderateScale(size)} color={color} />
    </Animated.View>
  );
}

function getTabLabel(routeName: string): string {
  switch (routeName) {
    case HomeTabsNames.Home:
      return 'Trang chủ';
    case HomeTabsNames.Cases:
      return 'Vụ án';
    case HomeTabsNames.Messages:
      return 'Tin nhắn';
    case HomeTabsNames.Documents:
      return 'Tài liệu';
    case HomeTabsNames.Setting:
      return 'Cài đặt';
    default:
      return routeName;
  }
}

function getTabAccessibilityLabel(routeName: string): string {
  switch (routeName) {
    case HomeTabsNames.Home:
      return 'Navigate to Home screen';
    case HomeTabsNames.Cases:
      return 'Navigate to Cases screen';
    case HomeTabsNames.Messages:
      return 'Navigate to Messages screen';
    case HomeTabsNames.Documents:
      return 'Navigate to Documents screen';
    case HomeTabsNames.Setting:
      return 'Navigate to Settings screen';
    default:
      return `Navigate to ${routeName} screen`;
  }
}

// Modern Tab Bar Styling
const $tabBar =
  (insets: any): ThemedStyle<ViewStyle> =>
  ({ colors, spacing }) => ({
    backgroundColor: colors.surfaceContainerLowest || '#FFFFFF',
    borderTopWidth: 0,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: verticalScale(spacing.xxxxxl) + insets.bottom, // 56px + safe area
    paddingBottom: Platform.OS === 'ios' ? insets.bottom : insets.bottom, // 8px : 2px + safe area
    paddingTop:
      Platform.OS === 'ios'
        ? verticalScale(spacing.xs)
        : verticalScale(spacing.xxxs), // 8px : 2px - cân đối với bottom
    paddingHorizontal: moderateScale(spacing.sm), // 12px
    justifyContent: 'center',
    alignItems: 'center',

    // Enhanced shadow for modern look
    shadowColor: colors.shadow || '#000000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  });

const $tabBarBackground: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.surfaceContainerLowest || '#FFFFFF',
  borderTopLeftRadius: moderateScale(20),
  borderTopRightRadius: moderateScale(20),
  borderTopWidth: 1,
  borderTopColor: colors.outlineVariant || 'rgba(0,0,0,0.05)',
});

const $tabBarActiveColor: ThemedStyle<string> = ({ colors }) =>
  colors.primary || '#3C3EB7';

const $tabBarInactiveColor: ThemedStyle<string> = ({ colors }) =>
  colors.onSurfaceVariant || '#8E8E93';

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: moderateScale(10),
  fontWeight: '600',
  marginTop: verticalScale(spacing.xxxs), // 2px
  color: colors.onSurface || '#1B1B22',
  letterSpacing: 0.05,
});

const $tabBarIcon: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: verticalScale(spacing.xxxs), // 2px
  alignItems: 'center',
  justifyContent: 'center',
});

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: verticalScale(spacing.xxxs), // 2px
  paddingHorizontal: moderateScale(spacing.xxxs), // 2px
  borderRadius: moderateScale(6),
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: verticalScale(spacing.xxxxl), // 48px
  minWidth: moderateScale(spacing.xxxl), // 40px
  flex: 1, // Để các tab items chia đều không gian
  // Add subtle background for active state
  backgroundColor: 'transparent',
  // Better touch feedback
  activeOpacity: 0.7,
});
