const Endpoints = {
  BASE_URL: 'https://hack.kinoko.su', // ваш Spring backend
  WS_URL: 'wss://hack.kinoko.su', // для SockJS (без ws://)
  AUTH_REFRESH: '/api/auth/refresh',
  AUTH_LOGIN: '/api/auth/authorization',
  AUTH_REG: '/api/auth/registration',
  AUTH_SEND_CODE: '/api/auth/send-code',
  AUTH_AUTH_CODE: '/api/auth/auth-code',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_WHO_AM_I: '/api/auth/user-info',
};

export default Endpoints;
