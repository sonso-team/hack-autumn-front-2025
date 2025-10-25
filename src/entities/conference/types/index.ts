export interface IConferenceData {
  roomId?: string;
}

export interface IConferenceResponse{
  roomId?: string;
  message?: string;
}

export interface IConferenceState {
  roomId?: string;
  isLoading?: boolean,
  isConnected?: boolean;
  message?: string;
  isError?: boolean;
}

export interface IAuthError {
  message: string;
}
