import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import { moderateScale } from 'react-native-size-matters';
import Icon from '@react-native-vector-icons/ionicons';
import * as styles from './styles';
interface LawyerCardProps {
  id: number;
  name: string;
  description: string;
  rating: number;
  price: number;
  imageUri: string;
  onPress?: () => void;
}

export default function LawyerCard({
  id,
  name,
  description,
  rating,
  price,
  imageUri,
  onPress,
}: LawyerCardProps) {
  const { themed, theme } = useAppTheme();

  return (
    <TouchableOpacity
      style={themed(styles.cardContainer)}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={themed(styles.imageContainer)}>
        <Image source={{ uri: imageUri }} style={themed(styles.profileImage)} />
      </View>

      <View style={themed(styles.contentContainer)}>
        <Text style={themed(styles.nameText)} numberOfLines={1}>
          {name}
        </Text>

        <Text style={themed(styles.descriptionText)} numberOfLines={2}>
          {description}
        </Text>

        <View style={themed(styles.bottomRow)}>
          <View style={themed(styles.ratingContainer)}>
            <Icon
              name="star"
              size={moderateScale(theme.fontSizes.sm)}
              color={theme.colors.primary}
            />
            <Text style={themed(styles.ratingText)}>{rating}</Text>
          </View>
          <Text style={themed(styles.priceText)}>
            ${price.toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
