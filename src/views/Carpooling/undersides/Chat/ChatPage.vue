<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/" />
        </IonButtons>
                  <div slot="secondary" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
          <img src="/images/KZS-LOGO_Graue_Schrift.svg" alt="Konrad-Zuse-Schule" style="padding: 5px; width: 128px;">
        </div>
      </IonToolbar>
    </IonHeader>

    <IonContent ref="chatContent" @ionScroll="handleScroll">
      <div class="chat-container">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', msg.senderId === userId ? 'own' : 'other']"
        >
          <div class="sender">{{ msg.senderId === userId ? 'Du' : msg.sender }}</div>
          <div class="bubble">{{ msg.message }}</div>
          <div class="timestamp">{{ msg.timestamp }}</div>
        </div>
      </div>
    </IonContent>

    <IonFooter>
      <IonToolbar>
        <IonInput
          v-model="newMessage"
          placeholder="Nachricht eingeben..."
          @keyup.enter="sendMessage"
        />
        <IonButton slot="end" @click="sendMessage">Senden</IonButton>
      </IonToolbar>
    </IonFooter>
  </IonPage>
</template>





<script setup>
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
  IonContent, IonFooter, IonButton, IonInput
} from '@ionic/vue';
import { ref, onMounted, nextTick } from 'vue';
import { io } from 'socket.io-client';

const messages = ref([]);
const newMessage = ref('');
const groupId = ref(null);
const userId = ref(null);
let socket = null;
const chatContent = ref(null);

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

const scrollToBottom = async () => {
  await nextTick();
  setTimeout(() => {
    const el = chatContent.value?.$el;
    if (el && typeof el.scrollToBottom === 'function') {
      el.scrollToBottom(300);
    }
  }, 50);
};

const fetchOlderMessages = async () => {
  const token = localStorage.getItem('token');
  if (!token || !groupId.value) return;

  const oldestMessage = messages.value[0];
  const before = oldestMessage ? new Date(oldestMessage.timestamp).toISOString() : null;

  try {
    const url = before
      ? `http://localhost:3000/messages/${groupId.value}?before=${before}`
      : `http://localhost:3000/messages/${groupId.value}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      const parsed = data.messages.map(msg => ({
        senderId: msg.senderId,
        sender: `${msg.firstname} ${msg.lastname}`,
        message: msg.message,
        timestamp: new Date(msg.timestamp).toLocaleString()
      }));
      messages.value.unshift(...parsed);
    }
  } catch (err) {
    console.error('❌ Fehler beim Laden älterer Nachrichten:', err);
  }
};

const handleScroll = async (event) => {
  const scrollTop = event.detail.scrollTop;
  if (scrollTop < 100) {
    await fetchOlderMessages();
  }
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !groupId.value || !userId.value) return;

  socket.emit('sendMessage', {
    groupId: groupId.value,
    senderId: userId.value,
    message: newMessage.value,
  });

  newMessage.value = '';
};

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const decoded = parseJwt(token);
  if (!decoded?.id) return;

  userId.value = decoded.id;

  socket = io('http://localhost:3000', {
    auth: { token },
  });

  try {
    const res = await fetch('http://localhost:3000/get-group-id', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    groupId.value = data.group_id;

    socket.emit('joinGroup');
    await fetchOlderMessages();
    scrollToBottom();
  } catch (err) {
    console.error('❌ Fehler beim Initialisieren:', err);
  }

  socket.on('receiveMessage', (data) => {
    messages.value.push({
      senderId: data.senderId,
      sender: data.senderName || 'Unbekannt',
      message: data.message,
      timestamp: new Date(data.timestamp).toLocaleString(),
    });
    scrollToBottom();
  });
});
</script>




<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
}
.message {
  max-width: 80%;
  padding: 8px;
  border-radius: 12px;
  margin-bottom: 10px;
}
.message.own {
  background-color: #6da3ff;
  color: black;
  font-weight: bold;
  font-size: 1.4rem;
  align-self: flex-end;
  text-align: right;
}
.message.other {
  background-color: #818181;
  color: black;
  font-weight: bold;
  font-size: 1.4rem;
  align-self: flex-start;
  text-align: left;
}
.sender {
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 2px;
}
.bubble {
  background-color: transparent;
  padding: 4px 0;
}
.timestamp {
  font-size: 0.7rem;
  margin-top: 2px;
}
</style>
