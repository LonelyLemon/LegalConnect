import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import { moderateScale } from 'react-native-size-matters';
import Icon from '@react-native-vector-icons/ionicons';
import * as styles from './styles';

interface ReviewCardProps {
  name: string;
  date: string;
  reviewText: string;
  rating: number;
  profileImage?: string;
  reviewImages?: string[];
}

export default function ReviewCard({
  name,
  date,
  reviewText,
  rating,
  profileImage,
  reviewImages,
}: ReviewCardProps) {
  const { themed, theme } = useAppTheme();

  return (
    <View style={themed(styles.cardContainer)}>
      <View style={themed(styles.headerRow)}>
        <Image
          source={{
            uri: profileImage || 'https://via.placeholder.com/40',
          }}
          style={themed(styles.profileImage)}
        />
        <View style={themed(styles.headerInfo)}>
          <Text style={themed(styles.nameText)} numberOfLines={1}>
            {name}
          </Text>
          <View style={themed(styles.dateContainer)}>
            <View style={themed(styles.dot)} />
            <Text style={themed(styles.dateText)}>{date}</Text>
          </View>
        </View>
      </View>

      <Text style={themed(styles.reviewText)}>{reviewText}</Text>

      {reviewImages && reviewImages.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={themed(styles.reviewImagesContainer)}
          contentContainerStyle={themed(styles.reviewImagesContent)}
        >
          {reviewImages.map((imageUri, index) => (
            <Image
              key={index}
              source={{ uri: imageUri }}
              style={themed(styles.reviewImage)}
            />
          ))}
        </ScrollView>
      )}

      <View style={themed(styles.ratingBadge)}>
        <Text style={themed(styles.ratingText)}>{rating}</Text>
        <Icon
          name="star"
          size={moderateScale(theme.fontSizes.sm)}
          color="#FFFFFF"
        />
      </View>
    </View>
  );
}
