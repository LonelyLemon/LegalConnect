import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles.ts';
import Icon from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { Document } from '../../../types/document';
import { moderateScale } from 'react-native-size-matters';

export interface DocumentCardProps {
  document?: Document;
  onPress?: () => void;
}

export default function DocumentCard(props: DocumentCardProps) {
  const navigation = useNavigation<any>();
  const { themed, theme } = useAppTheme();
  const title = props.document?.display_name || 'Document';
  const fileUrl = props.document?.file_url;
  const handlePress = () => {
    if (props.onPress) return props.onPress();
    if (fileUrl) navigation.navigate('PdfViewer', { url: fileUrl, title });
  };

  return (
    <TouchableOpacity
      style={themed(styles.card)}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View style={themed(styles.thumbnail)}>
        <View style={themed(styles.placeholder)}>
          <Icon
            name="document-text-outline"
            size={moderateScale(theme.fontSizes.xl)}
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      </View>
      <Text style={themed(styles.title)} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
