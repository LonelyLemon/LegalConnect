import axios from 'axios';
import { Conversation, MessageItem } from '../types/message';
import envConfig from '../config/env';

export const getAllConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await axios.get('/chat/conversations');
    return response.data as Conversation[];
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};

export const postNewConversation = async (
  receiverId: string,
): Promise<Conversation> => {
  try {
    const response = await axios.post('/chat/conversations', {
      recipient_id: receiverId,
    });
    return response.data as Conversation;
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};

export const getMessagesByConversationId = async (
  conversationId: string,
): Promise<MessageItem[]> => {
  try {
    const response = await axios.get(
      `/chat/conversations/${conversationId}/messages`,
    );

    // API có thể trả về trực tiếp array hoặc trong wrapper
    const messages = Array.isArray(response.data)
      ? response.data
      : response.data?.data || response.data?.messages || [];

    return messages as MessageItem[];
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};

export const postMessageToConversation = async (
  conversationId: string,
  content: string,
): Promise<MessageItem> => {
  try {
    const response = await axios.post(
      `/chat/conversations/${conversationId}/messages`,
      {
        content,
      },
    );
    return response.data as MessageItem;
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};

// Simple WS client for realtime chat
export type ChatEvent =
  | { type: 'message'; data: any }
  | { type: 'receipt'; data: any }
  | { type: 'presence'; data: any };

let ws: WebSocket | null = null;
let wsListeners: Array<(e: ChatEvent) => void> = [];

export const connectChatSocket = (token: string) => {
  try {
    if (ws && (ws as any).readyState === 1) return ws;
    const wsBase = envConfig.baseUrl
      .replace('https://', 'wss://')
      .replace('http://', 'ws://');
    ws = new WebSocket(`${wsBase}chat/ws?token=${encodeURIComponent(token)}`);
    ws.onmessage = evt => {
      try {
        const parsed = JSON.parse(evt.data);
        if (parsed?.type) {
          wsListeners.forEach(cb => cb(parsed as ChatEvent));
        }
      } catch {}
    };
    ws.onclose = () => {
      ws = null;
    };
    return ws;
  } catch (e) {
    console.log('ws connect error', e);
    return null;
  }
};

export const subscribeChatEvents = (cb: (e: ChatEvent) => void) => {
  wsListeners.push(cb);
  return () => {
    wsListeners = wsListeners.filter(l => l !== cb);
  };
};
