/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@react-native-vector-icons/ionicons';

import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles';

export default function ResetSuccessScreen() {
  const navigation = useNavigation<any>();
  const { themed, theme } = useAppTheme();

  return (
    <SafeAreaView style={themed(styles.container)}>
      <TouchableOpacity
        style={themed(styles.backButton)}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-back" size={theme.fontSizes.xl} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={themed(styles.scrollContainer)}>
        <View style={themed(styles.formContainer)}>
          <Text style={themed(styles.welcomeTitle)}>{'Password reset'}</Text>

          <TouchableOpacity
            style={themed(styles.primaryButton)}
            onPress={() => navigation.navigate('SetNewPassword')}
          >
            <Text style={themed(styles.primaryButtonText)}>{'Confirm'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {false && (
        <View style={themed(styles.loadingContainer)}>
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
}
