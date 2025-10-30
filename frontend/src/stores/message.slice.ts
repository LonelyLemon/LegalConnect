import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getAllConversations,
  getMessagesByConversationId,
  postMessageToConversation,
  postNewConversation,
} from '../services/message';
import { MessageState } from '../types/message';

const initialState: MessageState = {
  loadingConversations: false,
  loadingMessages: false,
  error: null,
  conversation: [],
  messages: [],
};

export const fetchConversations = createAsyncThunk(
  'message/fetchConversations',
  async (_, thunkApi) => {
    try {
      const response = await getAllConversations();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        'Đã có lỗi xảy ra khi tải cuộc trò chuyện. Vui lòng thử lại sau.',
      );
    }
  },
);

export const createNewConversation = createAsyncThunk(
  'message/createNewConversation',
  async ({ receiverId }: { receiverId: string }, thunkApi) => {
    try {
      const response = await postNewConversation(receiverId);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        'Đã có lỗi xảy ra khi tạo cuộc trò chuyện. Vui lòng thử lại sau.',
      );
    }
  },
);

export const fetchMessagesByConversationId = createAsyncThunk(
  'message/fetchMessagesByConversationId',
  async ({ conversationId }: { conversationId: string }, thunkApi) => {
    try {
      const response = await getMessagesByConversationId(conversationId);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        'Đã có lỗi xảy ra khi tải tin nhắn. Vui lòng thử lại sau.',
      );
    }
  },
);

export const sendMessageAction = createAsyncThunk(
  'message/sendMessage',
  async (
    { conversationId, content }: { conversationId: string; content: string },
    thunkApi,
  ) => {
    try {
      const response = await postMessageToConversation(conversationId, content);
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        'Đã có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.',
      );
    }
  },
);

export const messageSlice = createSlice({
  initialState,
  name: 'message',
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchConversations.pending, state => {
        state.loadingConversations = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversation = action.payload;
        state.loadingConversations = false;
        state.error = null;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.payload as string;
      })
      .addCase(createNewConversation.pending, state => {
        state.loadingConversations = true;
        state.error = null;
      })
      .addCase(createNewConversation.fulfilled, (state, action) => {
        state.conversation.push(action.payload);
        state.loadingConversations = false;
        state.error = null;
      })
      .addCase(createNewConversation.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMessagesByConversationId.pending, state => {
        state.messages = [];
        state.loadingMessages = true;
        state.error = null;
      })
      .addCase(fetchMessagesByConversationId.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loadingMessages = false;
        state.error = null;
      })
      .addCase(fetchMessagesByConversationId.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload as string;
      })
      .addCase(sendMessageAction.pending, state => {})
      .addCase(sendMessageAction.fulfilled, (state, action) => {})
      .addCase(sendMessageAction.rejected, (state, action) => {});
  },
});

export const messageReducer = messageSlice.reducer;
