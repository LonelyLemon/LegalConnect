import Header from '../../../components/layout/header';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { selectUser, signOut } from '../../../stores/user.slice';
import Icon from '@react-native-vector-icons/ionicons'; // Or any other icon library
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as styles from './styles';
import { useAppTheme } from '../../../theme/theme.provider';

function TextChild({ text }: { text: string }) {
  const { themed, theme } = useAppTheme();
  return (
    <View style={themed(styles.rowValueContainer)}>
      <Text style={themed(styles.rowValue)}>{text}</Text>
      <Icon name="chevron-forward" size={20} color={theme.colors.outline} />
    </View>
  );
}

export default function SettingScreen() {
  // --- Existing Hooks & State ---
  const { themed, themeType, setThemeType, theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  // --- State for New UI Elements ---

  const user = useAppSelector(selectUser);
  console.log('User data:', user);

  const handleChangeTheme = () => {
    const newTheme = themeType === 'light' ? 'dark' : 'light';
    setThemeType(newTheme);
  };

  const handleSignOut = () => {
    dispatch(signOut());
  };

  // --- Dummy data for user profile ---

  const handleEditProfile = () => {
    navigation.navigate('Profile');
  };

  const settingGroup = [
    {
      Father: TouchableOpacity,
      iconName: 'contrast-outline',
      title: 'Theme',
      onPress: handleChangeTheme,
      children: <TextChild text={themeType === 'light' ? 'Light' : 'Dark'} />,
    },
  ];

  const accountGroup = [
    {
      Father: TouchableOpacity,
      iconName: 'lock-closed-outline',
      title: 'Password',
      onPress: () => {},
      hasArrow: true,
    },
    {
      Father: TouchableOpacity,
      iconName: 'help-buoy-outline',
      title: 'Support',
      onPress: () => {},
      hasArrow: true,
    },
    {
      Father: TouchableOpacity,
      iconName: 'shield-checkmark-outline',
      title: 'Terms',
      onPress: () => {},
      hasArrow: true,
    },
    {
      Father: TouchableOpacity,
      iconName: 'log-out-outline',
      title: 'Logout',
      onPress: handleSignOut,
      hasArrow: false,
    },
  ];

  return (
    <SafeAreaView style={themed(styles.container)} edges={['top', 'bottom']}>
      <Header title="Setting" showBackButton={false} />

      {/* Header */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(80) }}
      >
        <View style={themed(styles.profileSection)}>
          {user?.avatar ? (
            <Image
              source={{ uri: user?.avatar }}
              style={themed(styles.avatar)}
            />
          ) : (
            <Icon
              name={'person-circle-outline'}
              size={scale(theme.spacing.xxxxxxl)}
              color={theme.colors.onBackground}
            />
          )}
          <Text style={themed(styles.profileName)}>{user?.name}</Text>
          <Text style={themed(styles.profileEmail)}>{user?.email}</Text>
          <TouchableOpacity
            style={themed(styles.editButton)}
            onPress={handleEditProfile}
          >
            <Text>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Preference */}

        <View style={themed(styles.section)}>
          <Text style={themed(styles.sectionTitle)}>Preferences</Text>

          <View style={themed(styles.group)}>
            {settingGroup.map((item, index) => (
              <View key={index}>
                <item.Father onPress={item.onPress} style={themed(styles.row)}>
                  <Icon
                    name={item.iconName as any}
                    size={moderateScale(theme.fontSizes.lg)}
                    color={theme.colors.outline}
                  />
                  <Text style={themed(styles.rowLabel)}>{item.title}</Text>
                  {item.children}
                </item.Father>
                {index !== settingGroup.length - 1 && (
                  <View style={themed(styles.separator)} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Account */}

        <View style={themed(styles.section)}>
          <Text style={themed(styles.sectionTitle)}>Account</Text>

          <View style={themed(styles.group)}>
            {accountGroup.map((item, index) => (
              <View key={index}>
                <item.Father onPress={item.onPress} style={themed(styles.row)}>
                  <Icon
                    name={item.iconName as any}
                    size={moderateScale(theme.fontSizes.lg)}
                    color={item.hasArrow ? theme.colors.outline : '#FF3B30'}
                  />
                  <Text
                    style={
                      item.hasArrow
                        ? themed(styles.rowLabel)
                        : themed(styles.logoutLabel)
                    }
                  >
                    {item.title}
                  </Text>
                  {item.hasArrow && (
                    <Icon
                      name="chevron-forward"
                      size={20}
                      color={theme.colors.outline}
                    />
                  )}
                </item.Father>
                {index !== accountGroup.length - 1 && (
                  <View style={themed(styles.separator)} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
