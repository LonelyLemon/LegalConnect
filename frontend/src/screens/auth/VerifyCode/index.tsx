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
import { t } from '../../../i18n';

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
      label: t('auth.verifyCode.enterCode'),
      type: 'input',
      placeholder: t('auth.verifyCode.codePlaceholder'),
      icon: 'keypad-outline',
      error: errors?.code?.message,
      rules: {
        required: { value: true, message: t('auth.verifyCode.codeRequired') },
        pattern: {
          value: /^[0-9]{6}$/,
          message: t('auth.verifyCode.codeInvalid'),
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
      <Header title={t('auth.verifyCode.title')} />

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
              {t('auth.verifyCode.verifyCode')}
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
