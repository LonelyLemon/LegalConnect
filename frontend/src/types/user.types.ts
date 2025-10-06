import { User } from './user';

export interface UserState {
  user: User;
  token: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  permissions: string[];
}

export interface UserAction {
  type: string;
  payload?: any;
}
