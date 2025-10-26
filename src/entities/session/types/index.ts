export interface IUser {
  id: string;
  email: string;
  name?: string;
  nickname?: string;
  createdAt?: string;
  role?: string;
  avatarPath?: string;
}
export interface IAuthResponse {
  user: IUser;
  token: string;
  message?: string;
}

export type IWhoAmIResponse = IUser;

export interface IAuthData {
  login?: string;
  nickname?: string;
  email?: string;
  fio?: string;
  password?: string;
}

export interface IAuthError {
  message: string;
}

export interface IAuthState {
  isError: boolean;
  isLoading: boolean;
  isAuth: boolean;
  user: IUser | null;
  message: string | null;
  goConfirmStep: boolean;
}
