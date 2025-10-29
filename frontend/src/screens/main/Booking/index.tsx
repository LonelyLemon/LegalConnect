import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles.ts';
import Header from '../../../components/layout/header/index.tsx';
import ControllerForm from '../../../components/common/controllerForm/index.tsx';
import DatePicker from '../../../components/common/datePicker/index.tsx';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Lawyer } from '../../../types/lawyer.ts';
import { createBookingRequest } from '../../../services/booking.ts';
import { fetchLawyerById } from '../../../stores/lawyer.slices.ts';
import { useAppDispatch } from '../../../redux/hook';
import dayjs from 'dayjs';

type FormBooking = {
  title: string;
  description: string;
  startTime: Date | null;
  endTime: Date | null;
};

export default function BookingScreen({
  route,
}: {
  route: RouteProp<{ params: { lawyerId: number } }, 'params'>;
}) {
  const { lawyerId } = route.params;
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(false);
  const [lawyerLoading, setLawyerLoading] = useState(true);

  const { themed, theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const control = useForm<FormBooking>({
    defaultValues: {
      title: '',
      description: '',
      startTime: null,
      endTime: null,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = control;


  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const response = await dispatch(fetchLawyerById(lawyerId));
        setLawyer(response.payload);
      } catch (error) {
        console.error('Failed to fetch lawyer:', error);
        // Không cần báo lỗi, vẫn cho phép tạo booking với lawyerId
      } finally {
        setLawyerLoading(false);
      }
    };
    fetchLawyer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, lawyerId]);

  const fields = [
    {
      id: 'title',
      name: 'title',
      label: 'Title',
      type: 'input',
      placeholder: 'Enter booking title',
      error: errors?.title?.message,
      rules: {
        required: { value: true, message: 'Title is required' },
      },
    },
    {
      id: 'description',
      name: 'description',
      label: 'Short Description',
      type: 'customRender',
      error: errors?.description?.message,
      rules: {
        required: { value: true, message: 'Short description is required' },
      },
      customRender: (value: string, onChange: (text: string) => void) => (
        <View style={themed(styles.textAreaContainer)}>
          <Text style={themed(styles.textAreaLabel)}>Short Description</Text>
          <TextInput
            style={[
              themed(styles.textArea),
              errors.description && themed(styles.textAreaError),
            ]}
            value={value}
            onChangeText={onChange}
            placeholder="Describe your legal needs..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && (
            <Text style={themed(styles.errorText)}>
              {errors.description.message}
            </Text>
          )}
        </View>
      ),
    },
    {
      id: 'startTime',
      name: 'startTime',
      label: 'Start Date',
      type: 'customRender',
      error: errors?.startTime?.message,
      rules: {
        required: { value: true, message: 'Start date is required' },
        validate: (value: Date | null) => {
          if (!value) return true;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(value);
          selectedDate.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            return 'Start date must be today or in the future';
          }
          return true;
        },
      },
      customRender: (value: Date | null, onChange: (date: Date) => void) => (
        <DatePicker
          label="Start Date"
          value={value}
          onChange={onChange}
          placeholder="Select start date"
          error={errors?.startTime?.message}
          minimumDate={new Date()}
        />
      ),
    },
    {
      id: 'endTime',
      name: 'endTime',
      label: 'End Date',
      type: 'customRender',
      error: errors?.endTime?.message,
      rules: {
        required: { value: true, message: 'End date is required' },
        validate: (value: Date | null) => {
          if (!value) return true;
          const startTime = control.getValues('startTime');
          if (startTime) {
            const startDate = new Date(startTime);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(value);
            endDate.setHours(0, 0, 0, 0);
            if (endDate < startDate) {
              return 'End date must be after or equal to start date';
            }
          }
          return true;
        },
      },
      customRender: (value: Date | null, onChange: (date: Date) => void) => (
        <DatePicker
          label="End Date"
          value={value}
          onChange={onChange}
          placeholder="Select end date"
          error={errors?.endTime?.message}
        />
      ),
    },
  ];

  const onSubmit = async (data: FormBooking) => {
    if (!data.startTime || !data.endTime) {
      return;
    }

    setLoading(true);
    try {
      await createBookingRequest({
        lawyer_id: lawyerId.toString(),
        title: data.title.trim(),
        short_description: data.description.trim(),
        desired_start_time: dayjs(data.startTime).toISOString(),
        desired_end_time: dayjs(data.endTime).toISOString(),
      });

      Alert.alert(
        'Success',
        'Booking request created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create booking request');
    } finally {
      setLoading(false);
    }
  };

  if (lawyerLoading) {
    return (
      <SafeAreaView style={themed(styles.container)}>
        <Header title="Book a Session" showBackButton={true} />
        <View style={themed(styles.loadingContainer)}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header title="Book a Session" showBackButton={true} />
      <ScrollView
        style={themed(styles.scrollContainer)}
        contentContainerStyle={themed(styles.contentContainer)}
        keyboardShouldPersistTaps="handled"
      >
        {lawyer && (
          <View style={themed(styles.lawyerInfo)}>
            <Image
              source={{ uri: lawyer.imageUri }}
              style={themed(styles.lawyerAvatar)}
            />
            <Text style={themed(styles.lawyerName)}>{lawyer.name}</Text>
            <Text style={themed(styles.lawyerBio)}>{lawyer.bio}</Text>
          </View>
        )}

        <View style={themed(styles.formContainer)}>
          <ControllerForm fields={fields} control={control} />

          <TouchableOpacity
            style={[
              themed(styles.submitButton),
              loading && themed(styles.submitButtonDisabled),
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              <Text style={themed(styles.submitButtonText)}>
                Submit Booking Request
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
