// lib/websocket.js
let socket = null;
let messageHandlers = [];

export const connectWebSocket = (roomId, playerId) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }

  socket = new WebSocket('wss://s14304.blr1.piesocket.com/v3/1?api_key=uvYfzw7iPOhoyyy20TAS7uEsfVsMCp3mJhz5NsGQ&notify_self=1');
  
  socket.onopen = () => {
    console.log('WebSocket connected');
    // 接続時に部屋に参加することを通知
    sendMessage({
      type: 'join_room',
      roomId,
      playerId
    });
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      messageHandlers.forEach(handler => handler(message));
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};

export const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not connected');
  }
};

export const addMessageHandler = (handler) => {
  messageHandlers.push(handler);
  return () => {
    messageHandlers = messageHandlers.filter(h => h !== handler);
  };
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
