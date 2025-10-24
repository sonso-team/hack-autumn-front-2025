// socket.ts
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(serverUrl: string): Socket {
    if (!this.socket) {
      this.socket = io(serverUrl, {
        transports: ['websocket'], // быстрее и стабильнее
      });

      this.socket.on('connect', () => {
        console.log('🟢 Сокет подключен:', this.socket?.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔴 Сокет отключен:', reason);
      });
    }
    return this.socket;
  }

  getSocket(): Socket {
    if (!this.socket) {
      throw new Error('❌ Сокет не инициализирован! Вызовите Connect().');
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = SocketService.getInstance();
