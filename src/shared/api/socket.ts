// src/shared/api/socket.ts
import type { IMessage } from '@stomp/stompjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { jwtDecode } from 'jwt-decode';

type EventHandler = (data: any) => void;

interface JwtPayload {
  userId: string;
}

class SocketService {
  private static instance: SocketService;
  private stompClient: Client | null = null;
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private currentRoomId: string | null = null;
  private currentSessionId: string | null = null;
  private isConnected: boolean = false;
  private name: string = 'Гость';

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  /**
   * Подключение к WebSocket серверу через SockJS
   */
  connect(serverUrl: string, name: string): Promise<void> {
    if (name) {
      this.name = name;
    }
    console.log(name, this.name);
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }

      this.stompClient = new Client({
        webSocketFactory: () => new SockJS(`${serverUrl}/ws/signaling`),

        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        onConnect: (frame) => {
          this.isConnected = true;
          resolve();
        },

        onDisconnect: () => {
          this.isConnected = false;
        },

        onStompError: (frame) => {
          reject(new Error(frame.headers['message']));
        },

        onWebSocketError: (event) => {
          reject(event);
        },
      });

      this.stompClient.activate();
    });
  }

  /**
   * Подписка на события
   */
  on(event: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)?.push(handler);
  }

  /**
   * Отписка от события
   */
  off(event?: string): void {
    if (event) {
      this.eventHandlers.delete(event);
    } else {
      this.eventHandlers.clear();
    }
  }

  /**
   * Отправка события
   */
  emit(event: string, data: any): void {
    if (!this.stompClient || !this.isConnected) {
      console.error('❌ Сокет не подключен!');
      return;
    }

    const destination = this.getDestination(event);

    this.stompClient.publish({
      destination,
      body: JSON.stringify(data),
    });
  }

  /**
   * Присоединение к комнате
   */
  joinRoom(roomId: string): void {
    if (!this.stompClient || !this.isConnected) {
      return;
    }

    this.currentRoomId = roomId;

    // ✅ Определяем тип пользователя
    const token = localStorage.getItem('token');
    let userId: string | null = null;

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        userId = decoded.userId;
      } catch (error) {
        console.error('Ошибка декодирования токена:', error);
      }
    }

    // Подписываемся на события комнаты
    this.subscribeToRoomEvents(roomId);

    // ✅ Отправляем запрос на присоединение с userId или guestName
    console.log(roomId, this.name);
    this.emit('join-room', {
      roomId,
      userId: userId || null,
      guestName: this.name,
    });
  }

  /**
   * Подписка на события комнаты
   */
  private subscribeToRoomEvents(roomId: string): void {
    if (!this.stompClient) {
      return;
    }

    console.log(`📡 Подписка на события комнаты ${roomId}`);

    // ✅ Список участников (с данными)
    this.stompClient.subscribe(
      `/topic/room/${roomId}/participants`,
      (message: IMessage) => {
        const messageId = message.headers['message-id'];

        // Сохраняем session ID при первом получении
        if (messageId && !this.currentSessionId) {
          this.currentSessionId = messageId.split('-')[0];
          // Подписываемся на личные топики ПОСЛЕ получения sessionId
          this.subscribeToPersonalTopics(roomId);
        }

        const data = JSON.parse(message.body);

        // ✅ Теперь participants это массив ParticipantInfo
        this.trigger('participants', data.participants);
      },
    );

    // Участник вышел
    this.stompClient.subscribe(
      `/topic/room/${roomId}/user-left`,
      (message: IMessage) => {
        const data = JSON.parse(message.body);
        this.trigger('user-left', { socketId: data.socketId });
      },
    );
  }

  /**
   * Подписка на личные топики после получения sessionId
   */
  private subscribeToPersonalTopics(roomId: string): void {
    if (!this.stompClient || !this.currentSessionId) {
      return;
    }

    const sessionId = this.currentSessionId;

    // ✅ user-joined (с данными участника)
    this.stompClient.subscribe(
      `/topic/room/${roomId}/user-joined-${sessionId}`,
      (message: IMessage) => {
        const data = JSON.parse(message.body);

        // ✅ Передаём все данные участника
        this.trigger('user-joined', {
          sessionId: data.sessionId,
          userId: data.userId,
          nickname: data.nickname,
          avatarUrl: data.avatarUrl,
          isGuest: data.isGuest,
        });
      },
    );

    // Offer
    this.stompClient.subscribe(
      `/topic/room/offer/${sessionId}`,
      (message: IMessage) => {
        const data = JSON.parse(message.body);
        this.trigger('offer', { offer: data.offer, from: data.from });
      },
    );

    // Answer
    this.stompClient.subscribe(
      `/topic/room/answer/${sessionId}`,
      (message: IMessage) => {
        const data = JSON.parse(message.body);
        this.trigger('answer', { answer: data.answer, from: data.from });
      },
    );

    // ICE Candidate
    this.stompClient.subscribe(
      `/topic/room/ice-candidate/${sessionId}`,
      (message: IMessage) => {
        const data = JSON.parse(message.body);
        this.trigger('ice-candidate', {
          candidate: data.candidate,
          from: data.from,
        });
      },
    );
  }

  /**
   * Маппинг событий -> destinations
   */
  private getDestination(event: string): string {
    const mapping: Record<string, string> = {
      'join-room': '/app/join-room',
      offer: '/app/offer',
      answer: '/app/answer',
      'ice-candidate': '/app/ice-candidate',
    };
    return mapping[event] || `/app/${event}`;
  }

  /**
   * Триггер обработчиков событий
   */
  private trigger(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach((handler) => handler(data));
  }

  /**
   * Получить сокет
   */
  getSocket(): SocketService {
    if (!this.isConnected) {
      throw new Error('❌ Сокет не инициализирован! Вызовите connect().');
    }
    return this;
  }

  /**
   * Session ID
   */
  get id(): string | undefined {
    return this.currentSessionId || undefined;
  }

  /**
   * Отключение
   */
  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.isConnected = false;
      this.currentRoomId = null;
      this.currentSessionId = null;
      this.eventHandlers.clear();
    }
  }
}

export const socketService = SocketService.getInstance();
