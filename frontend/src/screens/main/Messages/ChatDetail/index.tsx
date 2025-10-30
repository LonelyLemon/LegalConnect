import Ionicons from '@react-native-vector-icons/ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { useAppDispatch, useAppSelector } from '../../../../redux/hook';
import {
  fetchMessagesByConversationId,
  sendMessageAction,
} from '../../../../stores/message.slice.ts';
import { useAppTheme } from '../../../../theme/theme.provider';
import { MessageItem } from '../../../../types/message.ts';
import * as styles from './styles';
import dayjs from 'dayjs';
import {
  connectChatSocket,
  subscribeChatEvents,
} from '../../../../services/message';
import { store } from '../../../../redux/store';

// type Message = {
//   id: string;
//   text: string;
//   isMe: boolean;
//   time: string;
//   avatar?: string;
// };

// type ChatDetailProps = {
//   route: {
//     params: {
//       chatId: string;
//       name: string;
//       avatar: string;
//     };
//   };
// };

// const mockMessages: Message[] = [
//   {
//     id: '1',
//     text: 'Hello',
//     isMe: true,
//     time: '9:30 AM',
//   },
//   {
//     id: '2',
//     text: "Hi, I'm Sansa",
//     isMe: false,
//     time: '9:31 AM',
//     avatar:
//       'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop',
//   },
//   {
//     id: '3',
//     text: "I'm looking for an legal matter advisor, can you assist me?",
//     isMe: true,
//     time: '9:32 AM',
//   },
//   {
//     id: '4',
//     text: 'Sure, how can I help?',
//     isMe: false,
//     time: '9:33 AM',
//     avatar:
//       'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop',
//   },
// ];

function MessageItemComponent({
  item,
  userId,
}: {
  item: MessageItem;
  userId: string;
}) {
  const { themed } = useAppTheme();

  const isMe = item.sender_id === userId;

  return (
    <View
      style={[
        themed(styles.messageContainer),
        isMe ? themed(styles.myMessage) : themed(styles.otherMessage),
      ]}
    >
      {/* {!isMe && item.avatar && (
        <Image
          source={{ uri: item.avatar }}
          style={themed(styles.messageAvatar)}
        />
      )} */}
      <View
        style={[
          themed(styles.messageBubble),
          isMe ? themed(styles.myBubble) : themed(styles.otherBubble),
        ]}
      >
        <Text
          style={[
            themed(styles.messageText),
            isMe
              ? themed(styles.myMessageText)
              : themed(styles.otherMessageText),
          ]}
        >
          {item.content}
        </Text>
        <Text
          style={[
            themed(styles.messageTime),
            isMe
              ? themed(styles.myMessageTime)
              : themed(styles.otherMessageTime),
          ]}
        >
          {dayjs(item.created_at).format('HH:mm')}
        </Text>
      </View>
    </View>
  );
}

export default function ChatDetailScreen({ route }: { route: any }) {
  const { theme, themed } = useAppTheme();
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  const { chatId, name } = route.params;
  const messageList = useAppSelector((state: any) => state.message.messages);
  const loadingMessages = useAppSelector(
    (state: any) => state.message.loadingMessages,
  );
  const userId = useAppSelector((state: any) => state.user.user.id);

  useEffect(() => {
    // Ensure WS connection
    const token =
      store.getState()?.user?.token?.replace(/^Bearer\s+/i, '') || '';
    if (token) {
      connectChatSocket(token);
    }
    const unsubscribe = subscribeChatEvents(evt => {
      if (evt.type === 'message') {
        const msg = evt.data;
        if (msg?.conversation_id === chatId) {
          // Optimistically append incoming message
          // Re-dispatch fetch could be heavy; for now, refetch
          dispatch(fetchMessagesByConversationId({ conversationId: chatId }));
        }
      }
    });
    dispatch(fetchMessagesByConversationId({ conversationId: chatId }));
    return () => {
      unsubscribe();
    };
  }, [dispatch, chatId]);

  const [inputText, setInputText] = useState('');

  // const renderMessage = ({ item }: { item: Message }) => (
  //   <View
  //     style={[
  //       themed(styles.messageContainer),
  //       item.isMe ? themed(styles.myMessage) : themed(styles.otherMessage),
  //     ]}
  //   >
  //     {!item.isMe && item.avatar && (
  //       <Image
  //         source={{ uri: item.avatar }}
  //         style={themed(styles.messageAvatar)}
  //       />
  //     )}
  //     <View
  //       style={[
  //         themed(styles.messageBubble),
  //         item.isMe ? themed(styles.myBubble) : themed(styles.otherBubble),
  //       ]}
  //     >
  //       <Text
  //         style={[
  //           themed(styles.messageText),
  //           item.isMe
  //             ? themed(styles.myMessageText)
  //             : themed(styles.otherMessageText),
  //         ]}
  //       >
  //         {item.text}
  //       </Text>
  //       <Text
  //         style={[
  //           themed(styles.messageTime),
  //           item.isMe
  //             ? themed(styles.myMessageTime)
  //             : themed(styles.otherMessageTime),
  //         ]}
  //       >
  //         {item.time}
  //       </Text>
  //     </View>
  //   </View>
  // );

  const sendMessage = () => {
    if (inputText.trim()) {
      dispatch(
        sendMessageAction({ conversationId: chatId, content: inputText }),
      );
      setInputText('');
    }
  };

  return (
    <SafeAreaView style={themed(styles.container)}>
      {/* Header */}
      <View style={themed(styles.header)}>
        <TouchableOpacity
          style={themed(styles.backButton)}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={moderateScale(24)}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
        <View style={themed(styles.headerInfo)}>
          {/* <Image source={{ uri: avatar }} style={themed(styles.headerAvatar)} />
           */}
          <View style={themed(styles.avatarPlaceholder)}>
            <Ionicons
              name="person"
              size={moderateScale(16)}
              color={theme.colors.onSurfaceVariant}
            />
          </View>
          <Text style={themed(styles.headerName)}>{name}</Text>
        </View>
        <View style={themed(styles.headerActions)}>
          <TouchableOpacity style={themed(styles.actionButton)}>
            <Ionicons
              name="call"
              size={moderateScale(20)}
              color={theme.colors.onSurface}
            />
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
        {loadingMessages ? (
          <View>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={messageList}
            renderItem={({ item }) => (
              <MessageItemComponent item={item} userId={userId} />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={themed(styles.messagesList)}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input Area */}
        <View style={themed(styles.inputContainer)}>
          <View style={themed(styles.inputRow)}>
            <TouchableOpacity style={themed(styles.inputButton)}>
              <Ionicons name="add" size={moderateScale(20)} color="#666" />
            </TouchableOpacity>
            {/* <TouchableOpacity style={themed(styles.inputButton)}>
              <Ionicons
                name="happy-outline"
                size={moderateScale(20)}
                color="#666"
              />
            </TouchableOpacity> */}
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
