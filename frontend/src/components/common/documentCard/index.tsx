import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles.ts';

export interface DocumentCardProps {
  title: string;
  previewUrl?: string;
  onPress?: () => void;
}

export default function DocumentCard(props: DocumentCardProps) {
  const { title, previewUrl, onPress } = props;
  const { themed } = useAppTheme();

  return (
    <TouchableOpacity
      style={themed(styles.card)}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={themed(styles.thumbnail)}>
        {previewUrl ? (
          <Image source={{ uri: previewUrl }} style={themed(styles.image)} />
        ) : (
          <View style={themed(styles.placeholder)} />
        )}
      </View>
      <Text style={themed(styles.title)} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
