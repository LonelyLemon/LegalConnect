import React from 'react';
import { useForm } from 'react-hook-form';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs, { Dayjs } from 'dayjs';
import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles.ts';
import ControllerForm from '../../../components/common/controllerForm';
import Header from '../../../components/layout/header';
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
  const control = useForm<FormProfile>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      gender: 'Male',
      dob: dayjs(),
      pob: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = control;

  const fields = [
    {
      id: 'firstName',
      name: 'firstName',
      label: 'First name',
      type: 'input',
      placeholder: 'Enter your first name',
      error: errors?.firstName?.message,
      rules: { required: { value: true, message: 'First name is required' } },
    },
    {
      id: 'lastName',
      name: 'lastName',
      label: 'Last name',
      type: 'input',
      placeholder: 'Enter your first name',
      error: errors?.lastName?.message,
      rules: { required: { value: true, message: 'Last name is required' } },
    },
    {
      id: 'phone',
      name: 'phone',
      label: 'Phone number',
      type: 'input',
      placeholder: 'Enter your phone number',
      error: errors?.phone?.message,
      rules: { required: { value: true, message: 'Phone is required' } },
    },
    {
      id: 'address',
      name: 'address',
      label: 'Address',
      type: 'input',
      placeholder: 'Enter your address',
      error: errors?.address?.message,
      rules: { required: { value: true, message: 'Address is required' } },
    },
    {
      id: 'gender',
      name: 'gender',
      label: 'Gender',
      type: 'radio',
      options: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
      ],
      error: errors?.gender?.message,
      rules: { required: { value: true, message: 'Gender is required' } },
    },
    {
      id: 'dob',
      name: 'dob',
      label: 'Date of Birth',
      type: 'date',
      placeholder: 'YYYY-MM-DD',
      error: errors?.dob?.message,
      rules: { required: { value: true, message: 'DOB is required' } },
    },
    {
      id: 'pob',
      name: 'pob',
      label: 'Place of Birth',
      type: 'input',
      placeholder: 'Enter your place of birth',
      error: errors?.pob?.message,
      rules: { required: { value: true, message: 'Place is required' } },
    },
  ];

  const onSubmit = (_: FormProfile) => {
    // Submit to API later
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header title="Complete your profile" navigation="Welcome" />
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
            <Text style={themed(styles.primaryButtonText)}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
