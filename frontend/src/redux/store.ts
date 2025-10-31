import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from '../stores/user.slice';
import { documentReducer } from '../stores/document.slice';
import { lawyerReducer } from '../stores/lawyer.slices';
import { caseReducer } from '../stores/case.slice';
import { messageReducer } from '../stores/message.slice';
import { chatbotReducer } from '../stores/chatbot.slice';

const allReducers = {
  user: userReducer,
  document: documentReducer,
  lawyer: lawyerReducer,
  case: caseReducer,
  message: messageReducer,
  chatbot: chatbotReducer,
};

export const rootReducer = combineReducers(allReducers);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [],
  whiteList: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
