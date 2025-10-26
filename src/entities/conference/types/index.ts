export interface IConferenceData {
  roomId?: string;
  name?: string;
  type?: string;
  description?: string;
  accessCode?: string;
  maxParticipants?: number;
}

export type IConferenceResponse = string;

export interface IConferenceState {
  roomId?: string;
  isLoading?: boolean;
  isConnected?: boolean;
  message?: string;
  isError?: boolean;
  name?: string;
}

export interface IAuthError {
  message: string;
}
