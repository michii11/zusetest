// src/services/chatService.js

import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Ersetze dies mit der URL deines Express-Servers

export default {
  // Beitritt zu einer Gruppe (hier anhand der GroupId)
  joinGroup(groupId) {
    socket.emit('joinGroup', groupId);
  },

  // Sende eine Nachricht an die Gruppe
  sendMessage(groupId, senderId, message) {
    socket.emit('sendMessage', { groupId, senderId, message });
  },

  // Empfang von Nachrichten
  onReceiveMessage(callback) {
    socket.on('receiveMessage', (message) => {
      callback(message);
    });
  },

  // Trennen der Verbindung
  disconnect() {
    socket.disconnect();
  }
};
