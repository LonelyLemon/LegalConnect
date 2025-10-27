import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../theme/theme.provider';
import * as styles from './styles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackNames } from '../../../navigation/routes';

type ChatItem = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  online?: boolean;
};

const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'Henry Carvis',
    avatar:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop',
    lastMessage: 'Good afternoon George, ...',
    time: 'Just Now',
    online: true,
  },
  {
    id: '2',
    name: 'Hank Slarry',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    lastMessage: 'You: Hi!',
    time: 'Just Now',
  },
  {
    id: '3',
    name: 'Miali Ibinis',
    avatar:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop',
    lastMessage: "What's the procedure?",
    time: 'Just Now',
  },
  {
    id: '4',
    name: 'George Sina',
    avatar:
      'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop',
    lastMessage: "You: It's a pleasure meeting you!",
    time: '2 hours ago',
  },
];

export default function MessagesScreen() {
  const { themed } = useAppTheme();
  const navigation = useNavigation<NavigationProp<any>>();

  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={themed(styles.card)}
      onPress={() =>
        navigation.navigate(MainStackNames.ChatDetail, {
          chatId: item.id,
          name: item.name,
          avatar: item.avatar,
        })
      }
    >
      <View style={themed(styles.avatarWrapper)}>
        <Image source={{ uri: item.avatar }} style={themed(styles.avatar)} />
        {item.online ? <View style={themed(styles.onlineDot)} /> : null}
      </View>
      <View style={themed(styles.content)}>
        <View style={themed(styles.nameRow)}>
          <Text style={themed(styles.name)} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={themed(styles.timeText)}>{item.time}</Text>
        </View>
        <View style={themed(styles.messageRow)}>
          <Text style={themed(styles.lastMessage)} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          <Text style={themed(styles.ticks)}>✓✓</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={themed(styles.container)}>
      <FlatList
        data={mockChats}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={themed(styles.listContent)}
      />
    </SafeAreaView>
  );
}
