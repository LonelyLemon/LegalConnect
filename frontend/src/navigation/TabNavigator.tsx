/* eslint-disable react/no-unstable-nested-components */
import Icon from '@react-native-vector-icons/ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemedStyle } from '../theme';
import React, { useState } from 'react';
import { ViewStyle, Platform } from 'react-native';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import { HomeTabsNames, HomeTabsRoutes, StackScreenRoute } from './routes';
import { useAppTheme } from '../theme/theme.provider';

export default function TabNavigator() {
  const [tick] = useState(0); // Dummy state to force re-render
  const { themed } = useAppTheme();

  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      key={tick}
      screenOptions={{
        headerShown: false,
        tabBarStyle: themed($tabBar),
        tabBarActiveTintColor: '#2F6FED',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarIconStyle: themed($tabBarIcon),
        tabBarItemStyle: themed($tabBarItem),
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
      }}
    >
      {HomeTabsRoutes.map((route: StackScreenRoute) => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: any = 'home';

              if (route.name === HomeTabsNames.Home) {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === HomeTabsNames.Setting) {
                iconName = focused ? 'settings' : 'settings-outline';
              }

              return (
                <Icon
                  name={iconName}
                  size={moderateScale(size)}
                  color={color}
                />
              );
            },
            tabBarLabel: getTabLabel(route.name),
            headerShown: false,
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

function getTabLabel(routeName: string): string {
  switch (routeName) {
    case HomeTabsNames.Home:
      return 'Trang chủ';
    case HomeTabsNames.Setting:
      return 'Cài đặt';
    default:
      return routeName;
  }
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.surfaceContainer || '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: colors.outline || '#E5E5EA',
  paddingTop: verticalScale(8),
  paddingBottom: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(8),
  height: Platform.OS === 'ios' ? verticalScale(90) : verticalScale(70),
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: -2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 10,
});

const $tabBarLabel: ThemedStyle<any> = ({}) => ({
  fontSize: moderateScale(12),
  fontWeight: '600',
  marginTop: verticalScale(4),
});

const $tabBarIcon: ThemedStyle<any> = () => ({
  marginTop: verticalScale(4),
});

const $tabBarItem: ThemedStyle<any> = () => ({
  paddingVertical: verticalScale(4),
});
