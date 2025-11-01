import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles.ts';
import ControllerForm from '../../../components/common/controllerForm';
import Header from '../../../components/layout/header';
import { useTranslation } from 'react-i18next';
// @ts-ignore - React Native image module resolution
import AvatarPlaceholder from '../../../assets/imgs/Logo.png';
import { useAppDispatch, useAppSelector } from '../../../redux/hook.ts';
import { selectUser, updateUserProfile, getUserInfo } from '../../../stores/user.slice.ts';
import { MainStackNames } from '../../../navigation/routes.ts';
import { useNavigation } from '@react-navigation/native';
import { pick, types } from '@react-native-documents/picker';
import { uploadAvatar } from '../../../services/auth';
import Icon from '@react-native-vector-icons/ionicons';
import { moderateScale } from 'react-native-size-matters';

type FormProfile = {
  username: string;
  email: string;
  phone_number: string;
  address: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
};

export default function CompleteProfileScreen({}) {
  const user = useAppSelector(selectUser);
  const { t } = useTranslation();
  const { themed, theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [avatarUri, setAvatarUri] = useState<string | null>(
    user?.avatar || null,
  );
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Update avatar when user changes (only if not currently showing a local preview)
  React.useEffect(() => {
    const currentAvatar = user?.avatar;
    if (currentAvatar && currentAvatar.trim() !== '') {
      // Only update if current avatarUri is a server URL or null (not a local file)
      if (!avatarUri || (!avatarUri.startsWith('file://') && !avatarUri.startsWith('content://'))) {
        // Validate URL format
        try {
          if (currentAvatar.startsWith('http://') || currentAvatar.startsWith('https://')) {
            new URL(currentAvatar);
            setAvatarUri(currentAvatar);
          } else if (currentAvatar.startsWith('file://') || currentAvatar.startsWith('content://')) {
            setAvatarUri(currentAvatar);
          }
        } catch (error) {
          console.error('Invalid avatar URL from user:', currentAvatar);
          setAvatarUri(null);
          setImageLoadError(false);
        }
      }
    } else if (!avatarUri || (!avatarUri.startsWith('file://') && !avatarUri.startsWith('content://'))) {
      // Only reset if not showing a local preview
      setAvatarUri(null);
      setImageLoadError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.avatar]);

  const userData: FormProfile = {
    username: user?.username ?? '',
    email: user?.email ?? '',
    phone_number: user?.phone_number ?? '',
    address: user?.address ?? '',
    gender: 'Male',
    dob: dayjs().format('YYYY-MM-DD'),
  };
  const control = useForm<FormProfile>({
    defaultValues: userData,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = control;

  // Handle avatar image picker
  const handlePickAvatar = async () => {
    try {
      const res = await pick({
        type: [types.images],
        allowMultiSelection: false,
      });

      if (!res || res.length === 0) {
        return;
      }

      const file = res[0];
      
      // Show preview immediately with local file URI
      if (file.uri) {
        setAvatarUri(file.uri);
        setImageLoadError(false); // Reset error state for new image
      }

      // Upload in the background
      setUploadingAvatar(true);

      try {
        // Upload avatar after showing preview
        const result = await uploadAvatar({
          uri: file.uri,
          type: file.type || 'image/jpeg',
          name: file.name || 'avatar.jpg',
        });

        // Update with server URL after upload completes
        // API returns avatar_url, map it properly
        let newAvatarUrl = null;
        if (result?.avatar_url) {
          newAvatarUrl = result.avatar_url;
        } else if (result?.user?.avatar_url) {
          newAvatarUrl = result.user.avatar_url;
        } else if (result?.user?.avatar) {
          newAvatarUrl = result.user.avatar;
        } else if (result?.avatar) {
          newAvatarUrl = result.avatar;
        }

        if (newAvatarUrl && newAvatarUrl.trim() !== '') {
          // Validate URL before setting
          try {
            new URL(newAvatarUrl);
            setAvatarUri(newAvatarUrl);
            setImageLoadError(false); // Reset error state for new server URL
            // Update user info in store to get latest user data
            dispatch(getUserInfo());
          } catch (urlError) {
            console.error('Invalid avatar URL:', newAvatarUrl, urlError);
            // Keep local preview if server URL is invalid
          }
        }
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        // On error, keep the local preview but show error was handled by uploadAvatar
      } finally {
        setUploadingAvatar(false);
      }
    } catch (error: any) {
      if (error?.code !== 'DOCUMENT_PICKER_CANCELED') {
        console.error('Failed to pick image:', error);
      }
      setUploadingAvatar(false);
    }
  };

  const fields = [
    {
      id: 'username',
      name: 'username',
      label: t('auth.completeProfile.username'),
      type: 'input',
      placeholder: t('auth.completeProfile.enterUsername'),
      error: errors?.username?.message,
      rules: {
        required: {
          value: true,
          message: t('auth.completeProfile.userNameRequired'),
        },
      },
    },
    {
      id: 'phone_number',
      name: 'phone_number',
      label: t('auth.completeProfile.phone'),
      type: 'input',
      placeholder: t('auth.completeProfile.enterPhone'),
      error: errors?.phone_number?.message,
      rules: {
        required: {
          value: true,
          message: t('auth.completeProfile.phoneRequired'),
        },
      },
    },
    {
      id: 'address',
      name: 'address',
      label: t('auth.completeProfile.address'),
      type: 'input',
      placeholder: t('auth.completeProfile.enterAddress'),
      error: errors?.address?.message,
      rules: {
        required: {
          value: true,
          message: t('auth.completeProfile.addressRequired'),
        },
      },
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
      rules: {
        required: {
          value: true,
          message: t('auth.completeProfile.genderRequired'),
        },
      },
    },
    {
      id: 'dob',
      name: 'dob',
      label: t('auth.completeProfile.dateOfBirth'),
      type: 'date',
      placeholder: 'YYYY-MM-DD',
      error: errors?.dob?.message,
      rules: {
        required: {
          value: true,
          message: t('auth.completeProfile.dobRequired'),
        },
      },
    },
  ];
  const onSubmit = (data: FormProfile) => {
    dispatch(updateUserProfile(data));
    navigation.navigate(MainStackNames.HomeTabs as never);
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      <Header
        title={t('auth.completeProfile.title')}
        showBackButton={true}
        navigation={
          !(user?.phone_number && user?.address) && user.role !== 'admin'
            ? MainStackNames.Setting
            : undefined
        }
      />
      <ScrollView
        contentContainerStyle={themed(styles.scrollContainer)}
        keyboardShouldPersistTaps="handled"
      >
        <View style={themed(styles.formContainer)}>
          {/* Avatar Preview with Camera Icon */}
          <View style={themed(styles.avatarContainer)}>
            <View style={themed(styles.avatarWrapper)} pointerEvents="box-none">
              {avatarUri && avatarUri.trim() !== '' && !imageLoadError ? (
                <Image 
                  source={{ uri: avatarUri }} 
                  style={themed(styles.avatar)}
                  resizeMode="cover"
                  onError={(error) => {
                    console.log('Failed to load avatar image:', avatarUri, error);
                    setImageLoadError(true);
                  }}
                  onLoad={() => {
                    console.log('Avatar image loaded successfully:', avatarUri);
                    setImageLoadError(false);
                  }}
                  pointerEvents="none"
                />
              ) : (
                <Image 
                  source={AvatarPlaceholder} 
                  style={themed(styles.avatar)}
                  resizeMode="cover"
                  pointerEvents="none"
                />
              )}
              <TouchableOpacity
                style={themed(styles.cameraButton)}
                onPress={handlePickAvatar}
                disabled={uploadingAvatar}
                activeOpacity={0.7}
              >
                {uploadingAvatar ? (
                  <ActivityIndicator 
                    size="small" 
                    color={theme.colors.onPrimary} 
                  />
                ) : (
                  <Icon
                    name="camera"
                    size={moderateScale(20)}
                    color={theme.colors.onPrimary}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <ControllerForm fields={fields} control={control} />

          <TouchableOpacity
            style={themed(styles.primaryButton)}
            onPress={handleSubmit(onSubmit)}
            disabled={
              !!errors.username ||
              !!errors.email ||
              !!errors.phone_number ||
              !!errors.address ||
              !!errors.gender ||
              !!errors.dob
            }
          >
            <Text style={themed(styles.primaryButtonText)}>
              {t('auth.completeProfile.continue')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
