import { signIn, signUp } from '../services/auth';
import { FormLogin, FormSignUp } from '../types/auth';
import { User } from '../types/user';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../types/user.types';
import { AxiosError } from 'axios';
const initialState: UserState = {
  user: {
    id: '',
    email: '',
    avatar: '',
    name: '',
  },
  permissions: [],
  token: '',
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

export const signInWithEmailPassword = createAsyncThunk(
  'user/signInWithEmailPassword',
  async (data: FormLogin, thunkApi) => {
    try {
      const response = await signIn(data);
      return {
        user: response.user as User,
        token: response.access_token as string,
        permissions: response.permissions as string[],
      };
    } catch (error: any) {
      if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(error.response?.data.message);
      }
      return thunkApi.rejectWithValue(error.message || 'Login failed');
    }
  },
);

export const signUpWithEmailPassword = createAsyncThunk(
  'user/signUpWithEmailPassword',
  async (data: FormSignUp, thunkApi) => {
    try {
      const response = await signUp(data);
      return {
        user: response.user as User,
        token: response.access_token as string,
        permissions: response.permissions as string[],
      };
    } catch (error: any) {
      if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(error.response?.data.message);
      }
      return thunkApi.rejectWithValue(error.message || 'Sign up failed');
    }
  },
);

export const signOut = createAsyncThunk('user/signOut', async () => {
  try {
    await new Promise((resolve: any) => setTimeout(resolve, 1000)); // Simulate network delay
  } catch (error) {}
});

export const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    isLogging: (state: UserState) => {
      state.isLoading = true;
    },
    isLoggedIn: (state: UserState, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    isLoggedOut: (state: UserState) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.user = {
        id: '',
        email: '',
        avatar: '',
        name: '',
      };
    },
    setUser: (state: UserState, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setNewToken: (state: UserState, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signInWithEmailPassword.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmailPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.permissions = action.payload.permissions;
      })
      .addCase(signInWithEmailPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signUpWithEmailPassword.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmailPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.permissions = action.payload.permissions;
      })
      .addCase(signUpWithEmailPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signOut.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, state => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = {
          id: '',
          email: '',
          avatar: '',
          name: '',
        };
        state.token = '';
        state.permissions = [];
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const userActions = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state?.user?.user;
export const selectIsLoggedIn = (state: { user: UserState }) =>
  state?.user?.isLoggedIn;
export const selectIsLoading = (state: { user: UserState }) =>
  state?.user?.isLoading;
export const selectError = (state: { user: UserState }) => state?.user?.error;
export const selectPermissions = (state: { user: UserState }) =>
  state?.user?.permissions;

const userReducer = userSlice.reducer;
export default userReducer;
