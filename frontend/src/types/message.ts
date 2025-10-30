export interface MessageItem {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  attachment_name?: string;
  attachment_url?: string;
  attachment_content_type?: string;
  attachment_size?: number;
  delivered_to: string[];
  read_by?: string[];
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
  participants: [
    {
      conversation_id: string;
      user: {
        id: string;
        username: string;
        email: string;
      };
      joined_at: string;
      last_read_at: string;
    },
  ];
  last_message?: MessageItem;
}

export interface MessageState {
  loadingConversations: boolean;
  loadingMessages: boolean;
  error: string | null;
  conversation: Conversation[];
  messages: MessageItem[];
}
