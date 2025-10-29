import React from 'react';
import { useForm } from 'react-hook-form';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import dayjs, { Dayjs } from 'dayjs';
import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles.ts';
import ControllerForm from '../../../components/common/controllerForm';
import Header from '../../../components/layout/header';
import { t } from '../../../i18n';
// @ts-ignore - React Native image module resolution
import AvatarPlaceholder from '../../../assets/imgs/Logo.png';

type FormProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: Dayjs;
  pob: string;
};

export default function CompleteProfileScreen() {
  const { themed } = useAppTheme();
  const route = useRoute<any>();
  const userData = route?.params?.userData as Partial<FormProfile> | undefined;

  const initialDefaults: FormProfile = {
    firstName: userData?.firstName ?? '',
    lastName: userData?.lastName ?? '',
    phone: userData?.phone ?? '',
    address: userData?.address ?? '',
    gender: (userData?.gender as any) ?? 'Male',
    dob: userData?.dob ? dayjs(userData.dob as any) : dayjs(),
    pob: userData?.pob ?? '',
  };

  const control = useForm<FormProfile>({
    defaultValues: initialDefaults,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = control;

  const fields = [
    {
      id: 'firstName',
      name: 'firstName',
      label: t('auth.completeProfile.firstName'),
      type: 'input',
      placeholder: t('auth.completeProfile.enterFirstName'),
      error: errors?.firstName?.message,
      rules: { required: { value: true, message: t('auth.completeProfile.firstNameRequired') } },
    },
    {
      id: 'lastName',
      name: 'lastName',
      label: t('auth.completeProfile.lastName'),
      type: 'input',
      placeholder: t('auth.completeProfile.enterLastName'),
      error: errors?.lastName?.message,
      rules: { required: { value: true, message: t('auth.completeProfile.lastNameRequired') } },
    },
    {
      id: 'phone',
      name: 'phone',
      label: t('auth.completeProfile.phone'),
      type: 'input',
      placeholder: t('auth.completeProfile.enterPhone'),
      error: errors?.phone?.message,
      rules: { required: { value: true, message: t('auth.completeProfile.phoneRequired') } },
    },
    {
      id: 'address',
      name: 'address',
      label: t('auth.completeProfile.address'),
      type: 'input',
      placeholder: t('auth.completeProfile.enterAddress'),
      error: errors?.address?.message,
      rules: { required: { value: true, message: t('auth.completeProfile.addressRequired') } },
    },
    {
      id: 'gender',
      name: 'gender',
      label: t('auth.completeProfile.gender'),
      type: 'radio',
      options: [
        { label: t('auth.completeProfile.male'), value: 'Male' },
        { label: t('auth.completeProfile.female'), value: 'Female' },
        { label: t('auth.completeProfile.other'), value: 'Other' },
      ],
      error: errors?.gender?.message,
      rules: { required: { value: true, message: t('auth.completeProfile.genderRequired') } },
    },
    {
      id: 'dob',
      name: 'dob',
      label: t('auth.completeProfile.dateOfBirth'),
      type: 'date',
      placeholder: 'YYYY-MM-DD',
      error: errors?.dob?.message,
      rules: { required: { value: true, message: t('auth.completeProfile.dobRequired') } },
    },
    {
      id: 'pob',
      name: 'pob',
      label: t('auth.completeProfile.placeOfBirth'),
      type: 'input',
      placeholder: t('auth.completeProfile.enterPlaceOfBirth'),
      error: errors?.pob?.message,
      rules: { required: { value: true, message: t('auth.completeProfile.placeRequired') } },
    },
  ];

  const onSubmit = (_: FormProfile) => {
    // Submit to API later
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header title={t('auth.completeProfile.title')} showBackButton={true} />
      <ScrollView
        contentContainerStyle={themed(styles.scrollContainer)}
        keyboardShouldPersistTaps="handled"
      >
        <View style={themed(styles.formContainer)}>
          <View style={themed(styles.avatarContainer)}>
            <Image source={AvatarPlaceholder} style={themed(styles.avatar)} />
          </View>

          <ControllerForm fields={fields} control={control} />

          <TouchableOpacity
            style={themed(styles.primaryButton)}
            onPress={handleSubmit(onSubmit)}
            disabled={
              !!errors.firstName ||
              !!errors.lastName ||
              !!errors.phone ||
              !!errors.address ||
              !!errors.gender ||
              !!errors.dob ||
              !!errors.pob
            }
          >
            <Text style={themed(styles.primaryButtonText)}>{t('auth.completeProfile.continue')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}