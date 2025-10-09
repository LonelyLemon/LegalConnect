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

import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles';
import Header from '../../../components/layout/header';

export default function ResetSuccessScreen() {
  const navigation = useNavigation<any>();
  const { themed } = useAppTheme();

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header title="Password reset" />
      <ScrollView contentContainerStyle={themed(styles.scrollContainer)}>
        <View style={themed(styles.formContainer)}>
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
