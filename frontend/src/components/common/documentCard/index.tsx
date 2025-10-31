import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles.ts';
import Icon from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';

export interface DocumentCardProps {
  title?: string;
  previewUrl?: string;
  document?: any;
  onPress?: () => void;
}

export default function DocumentCard(props: DocumentCardProps) {
  const navigation = useNavigation<any>();
  const { themed } = useAppTheme();
  const title = props.document?.display_name || props.title || 'Document';
  const previewUrl =
    props.document?.preview_url || props.document?.file_url || props.previewUrl;
  const handlePress = () => {
    if (props.onPress) return props.onPress();
    const url = props.document?.file_url || previewUrl;
    if (url) navigation.navigate('PdfViewer', { url, title });
  };

  return (
    <TouchableOpacity
      style={themed(styles.card)}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View style={themed(styles.thumbnail)}>
        {previewUrl ? (
          <Image source={{ uri: previewUrl }} style={themed(styles.image)} />
        ) : (
          <View style={themed(styles.placeholder)}>
            <Icon name="document-text-outline" size={24} />
          </View>
        )}
      </View>
      <Text style={themed(styles.title)} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
