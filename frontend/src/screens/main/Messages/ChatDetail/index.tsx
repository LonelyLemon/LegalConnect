import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAppTheme } from '../../../../theme/theme.provider';
import { moderateScale } from 'react-native-size-matters';
import * as styles from './styles';
import Ionicons from '@react-native-vector-icons/ionicons';

type Message = {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
  avatar?: string;
};

type ChatDetailProps = {
  route: {
    params: {
      chatId: string;
      name: string;
      avatar: string;
    };
  };
};

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hello',
    isMe: true,
    time: '9:30 AM',
  },
  {
    id: '2',
    text: "Hi, I'm Sansa",
    isMe: false,
    time: '9:31 AM',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    text: "I'm looking for an legal matter advisor, can you assist me?",
    isMe: true,
    time: '9:32 AM',
  },
  {
    id: '4',
    text: 'Sure, how can I help?',
    isMe: false,
    time: '9:33 AM',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop',
  },
];

export default function ChatDetailScreen({ route }: ChatDetailProps) {
  const { themed } = useAppTheme();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');

  const { name, avatar } = route.params;

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        themed(styles.messageContainer),
        item.isMe ? themed(styles.myMessage) : themed(styles.otherMessage),
      ]}
    >
      {!item.isMe && item.avatar && (
        <Image
          source={{ uri: item.avatar }}
          style={themed(styles.messageAvatar)}
        />
      )}
      <View
        style={[
          themed(styles.messageBubble),
          item.isMe ? themed(styles.myBubble) : themed(styles.otherBubble),
        ]}
      >
        <Text
          style={[
            themed(styles.messageText),
            item.isMe
              ? themed(styles.myMessageText)
              : themed(styles.otherMessageText),
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            themed(styles.messageTime),
            item.isMe
              ? themed(styles.myMessageTime)
              : themed(styles.otherMessageTime),
          ]}
        >
          {item.time}
        </Text>
      </View>
    </View>
  );

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        isMe: true,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      {/* Header */}
      <View style={themed(styles.header)}>
        <TouchableOpacity style={themed(styles.backButton)}>
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#000" />
        </TouchableOpacity>
        <View style={themed(styles.headerInfo)}>
          <Image source={{ uri: avatar }} style={themed(styles.headerAvatar)} />
          <Text style={themed(styles.headerName)}>{name}</Text>
        </View>
        <View style={themed(styles.headerActions)}>
          <TouchableOpacity style={themed(styles.actionButton)}>
            <Ionicons name="call" size={moderateScale(20)} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={themed(styles.actionButton)}>
            <Ionicons
              name="ellipsis-vertical"
              size={moderateScale(20)}
              color="#000"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={themed(styles.chatContainer)}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={themed(styles.messagesList)}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <View style={themed(styles.inputContainer)}>
          <View style={themed(styles.inputRow)}>
            <TouchableOpacity style={themed(styles.inputButton)}>
              <Ionicons name="add" size={moderateScale(20)} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={themed(styles.inputButton)}>
              <Ionicons
                name="happy-outline"
                size={moderateScale(20)}
                color="#666"
              />
            </TouchableOpacity>
            <View style={themed(styles.textInputContainer)}>
              <TextInput
                style={themed(styles.textInput)}
                placeholder="Type a message..."
                value={inputText}
                onChangeText={setInputText}
                multiline
              />
            </View>
            <TouchableOpacity
              style={themed(styles.sendButton)}
              onPress={sendMessage}
            >
              <Ionicons name="send" size={moderateScale(20)} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
