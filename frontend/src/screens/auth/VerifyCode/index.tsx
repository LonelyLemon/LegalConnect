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
import { useForm } from 'react-hook-form';
import { verticalScale } from 'react-native-size-matters';

import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles';
import ControllerForm from '../../../common/controllerForm';

type FormCode = { code: string };

export default function VerifyCodeScreen() {
  const navigation = useNavigation<any>();
  const { themed, theme } = useAppTheme();
  const control = useForm<FormCode>({ defaultValues: { code: '' } });
  const {
    handleSubmit,
    formState: { errors },
  } = control;

  const fields = [
    {
      id: 'code',
      name: 'code',
      label: 'Enter 4-digit code',
      type: 'input',
      placeholder: '____',
      icon: 'keypad-outline',
      error: errors?.code?.message,
      rules: { required: { value: true, message: 'Code is required' } },
    },
  ];

  const handleVerify = (_: FormCode) => {
    navigation.navigate('ResetSuccess');
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      <TouchableOpacity
        style={themed(styles.backButton)}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-back" size={theme.fontSizes.xl} />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={themed(styles.scrollContainer)}
        keyboardShouldPersistTaps="handled"
      >
        <View style={themed(styles.formContainer)}>
          <Text style={themed(styles.welcomeTitle)}>{'Check your email'}</Text>

          <View
            style={{
              marginBottom: verticalScale(theme.spacing.lg),
              marginTop: verticalScale(theme.spacing.lg),
            }}
          >
            <ControllerForm fields={fields} control={control} />
          </View>

          <TouchableOpacity
            style={themed(styles.primaryButton)}
            onPress={handleSubmit(handleVerify)}
            disabled={!!errors.code}
          >
            <Text style={themed(styles.primaryButtonText)}>
              {'Verify Code'}
            </Text>
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
