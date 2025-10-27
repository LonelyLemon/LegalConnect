import React from 'react';
import { View, FlatList } from 'react-native';
import { useAppTheme } from '../../../../theme/theme.provider';
import ReviewCard from '../../../../components/common/reviewCard/index.tsx';
import * as styles from './styles';

interface Review {
  id: string;
  name: string;
  date: string;
  reviewText: string;
  rating: number;
  profileImage?: string;
  reviewImages?: string[];
}

const mockReviews: Review[] = [
  {
    id: '1',
    name: 'Akhil Mirza',
    date: 'August 04, 2022',
    reviewText:
      "Akhil Mirza is an excellent lawyer who handled my case with utmost professionalism. I'm incredibly pleased with the positive outcome he achieved.",
    rating: 4.8,
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    reviewImages: [
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
    ],
  },
  {
    id: '2',
    name: 'Aman Khan',
    date: 'August 04, 2022',
    reviewText:
      "I was so impressed with Akhil's deep legal knowledge and compassionate approach. He made a difficult time much more manageable.",
    rating: 4.8,
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    reviewImages: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    ],
  },
  {
    id: '3',
    name: 'John Smith',
    date: 'August 04, 2022',
    reviewText:
      'Akhil is a highly reliable and efficient lawyer. He was always responsive and proactive, and I would recommend him to anyone needing legal help.',
    rating: 4.8,
    profileImage: 'https://randomuser.me/api/portraits/men/15.jpg',
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    date: 'August 04, 2022',
    reviewText:
      'Outstanding service! Akhil provided exceptional legal counsel and achieved great results. Highly professional and dedicated.',
    rating: 5.0,
    profileImage: 'https://randomuser.me/api/portraits/women/68.jpg',
    reviewImages: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    ],
  },
  {
    id: '5',
    name: 'Michael Chen',
    date: 'August 04, 2022',
    reviewText:
      "Akhil's expertise in legal matters is truly impressive. He guided me through a complex case with confidence and care.",
    rating: 4.9,
    profileImage: 'https://randomuser.me/api/portraits/men/45.jpg',
    reviewImages: [
      'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400',
    ],
  },
];

export default function Review({ lawyerId: _lawyerId }: { lawyerId: number }) {
  const { themed } = useAppTheme();

  return (
    <View style={themed(styles.container)}>
      <FlatList
        data={mockReviews}
        renderItem={({ item }) => (
          <ReviewCard
            name={item.name}
            date={item.date}
            reviewText={item.reviewText}
            rating={item.rating}
            profileImage={item.profileImage}
            reviewImages={item.reviewImages}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={themed(styles.listContainer)}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        nestedScrollEnabled={true}
      />
    </View>
  );
}
