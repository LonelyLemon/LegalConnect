import { User } from './user';

export interface UserState {
  user: User;
  token: string;
  refreshToken: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UserAction {
  type: string;
  payload?: any;
}
