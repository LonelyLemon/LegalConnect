import { pick, types } from '@react-native-documents/picker';
import { viewDocument } from '@react-native-documents/viewer';
import Icon from '@react-native-vector-icons/ionicons';
import {
  Alert,
  Image,
  ImageStyle,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles';
import React from 'react';

export interface FilePickerStyleOverride {
  label?: TextStyle;
  button?: ViewStyle;
  buttonText?: TextStyle;
  imagePlaceholder?: ViewStyle;
  imageStyle: ImageStyle;
  multipleFileList?: ViewStyle;
}

export interface File {
  name: string;
  uri: string;
  type?: string;
  size?: number;
}

export interface FilePickerProps {
  mode?: 'single' | 'multiple';
  fileType: 'image' | 'file';
  label?: string;
  required?: boolean;
  value: File | File[] | null;
  onChange: (file: File | File[] | null) => void;
  error?: string;
  styles?: FilePickerStyleOverride;
}

export default function FilePicker({
  mode = 'single',
  fileType = 'file',
  label,
  required,
  value,
  onChange,
  error,
  styles: styleOverride,
}: FilePickerProps) {
  const { theme, themed } = useAppTheme();
  const { t } = useTranslation();

  const pickFile = async () => {
    try {
      const res = await pick({
        type:
          fileType === 'image'
            ? [types.images]
            : [types.pdf, types.doc, types.docx],
        allowMultiSelection: mode === 'multiple',
      });
      if (!res) {
        return;
      }
      if (mode === 'single') {
        onChange({
          uri: res[0].uri,
          name: res[0].name || '',
          type: res[0].type || undefined,
          size: res[0].size || undefined,
        } as File);
      } else {
        const rs = res.map(file => ({
          uri: file.uri,
          name: file.name || '',
          type: file.type || undefined,
          size: file.size || undefined,
        })) as File[];
        onChange(rs);
      }
    } catch (e) {
      console.error('Error picking file:', e);
    }
  };

  const viewFile = async (value: File) => {
    try {
      if (!value) {
        return;
      }
      viewDocument({
        uri: value.uri,
        mimeType: value.type || '',
      });
    } catch (e) {
      console.error('Error viewing file:', e);
    }
  };

  const onDeletePress = () => {
    Alert.alert(
      t('common.deleteFile'),
      t('common.deleteFileConfirmation'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.delete'),
          onPress: () => {
            if (mode === 'single') {
              onChange(null);
            } else {
              onChange([]);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={themed(styles.container)}>
      {label && (
        <Text style={[themed(styles.label), styleOverride?.label]}>
          {label}
          {required && <Text style={themed(styles.required)}> *</Text>}
        </Text>
      )}
      <View style={themed(styles.chooseFileContainer)}>
        <TouchableOpacity
          onPress={pickFile}
          style={[themed(styles.chooseFile), styleOverride?.button]}
        >
          <Text
            style={[themed(styles.chooseFileText), styleOverride?.buttonText]}
          >
            {t('common.chooseFile')}
          </Text>
        </TouchableOpacity>
        {!value ||
        !(value as File).name ||
        (value as File).name.trim() === '' ||
        (value as File[]).length === 0 ? null : (
          <TouchableOpacity onPress={onDeletePress}>
            <Icon
              name="trash"
              size={scale(theme.fontSizes.xl)}
              color={theme.colors.error}
            />
          </TouchableOpacity>
        )}
      </View>
      {value &&
        fileType === 'file' &&
        (mode === 'single' ? (
          <TouchableOpacity onPress={() => viewFile(value as File)}>
            <Text style={themed(styles.fileName)}>{(value as File).name}</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={[themed(styles.fileList), styleOverride?.multipleFileList]}
          >
            {(value as File[]).map((file, index) => (
              <TouchableOpacity key={index} onPress={() => viewFile(file)}>
                <Text style={themed(styles.fileName)}>{file.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      {(!value ||
        !(value as File).name ||
        (value as File).name.trim() === '' ||
        (value as File[]).length === 0) &&
        fileType === 'image' && (
          <View
            style={[
              themed(styles.imagePlaceholder),
              error ? themed(styles.imagePlaceholderError) : null,
              styleOverride?.imagePlaceholder,
            ]}
          >
            <Icon
              name="image"
              size={scale(theme.fontSizes.xl)}
              color={theme.colors.outline}
            />
          </View>
        )}
      {value &&
        fileType === 'image' &&
        (mode === 'single' ? (
          <Image
            source={{ uri: (value as File).uri }}
            style={[themed(styles.image), styleOverride?.imageStyle]}
          />
        ) : (
          <View
            style={[themed(styles.fileList), styleOverride?.multipleFileList]}
          >
            {(value as File[]).length > 0 &&
              (value as File[]).map((file, index) => (
                <Image
                  key={index}
                  source={{ uri: file.uri }}
                  style={[themed(styles.image), styleOverride?.imageStyle]}
                />
              ))}
          </View>
        ))}
      {error && <Text style={themed(styles.error)}>{error}</Text>}
    </View>
  );
}
