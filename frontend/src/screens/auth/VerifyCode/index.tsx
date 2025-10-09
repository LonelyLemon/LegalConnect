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
import { useForm } from 'react-hook-form';
import { verticalScale } from 'react-native-size-matters';

import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles';
import ControllerForm from '../../../components/common/controllerForm';
import Header from '../../../components/layout/header';

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
      label: 'Enter 6-digit code',
      type: 'input',
      placeholder: 'Enter the verification code sent to your email',
      icon: 'keypad-outline',
      error: errors?.code?.message,
      rules: {
        required: { value: true, message: 'Code is required' },
        pattern: {
          value: /^[0-9]{6}$/,
          message: 'Code must be 6 digits',
        },
      },
      keyboardType: 'numeric',
    },
  ];

  const handleVerify = (_: FormCode) => {
    navigation.navigate('ResetSuccess');
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header title="Verify Code" />

      <ScrollView
        contentContainerStyle={themed(styles.scrollContainer)}
        keyboardShouldPersistTaps="handled"
      >
        <View style={themed(styles.formContainer)}>
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
