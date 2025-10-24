import Endpoints from './endpoints';

let socket: WebSocket | null = null;

export const getSocket = (): WebSocket => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(`${Endpoints.WS_URL}/ws`);
  }
  return socket;
};

export const closeSocket = (): void => {
  socket?.close();
  socket = null;
};
