<template>
  <ion-page>
    <!-- Kopfleiste -->
    <ion-header>
      <ion-toolbar>
<div slot="secondary" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
          <img src="/images/KZS-LOGO_Graue_Schrift.svg" alt="Konrad-Zuse-Schule" style="padding: 5px; width: 128px;">
        </div>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Body Bereich -->
    <ion-content>
      <ion-searchbar v-model="searchQuery" animated placeholder="Wohnort"></ion-searchbar>

      <ion-card
        v-for="car in filteredCarpools"
        :key="car.ccr_id"
        @click="openRequestModal(car.user_id)"
        button
      >
        <ion-card-title>{{ car.location }}</ion-card-title>
        <ion-card-content>
          Sitzplätze: {{ car.seats }}<br />
          PLZ: {{ car.postcode }}
        </ion-card-content>
      </ion-card>




      <ion-modal :is-open="showModal" @didDismiss="closeRequestModal">
        <ion-content class="ion-padding">
          <ion-card>
            <ion-card-title>{{$t('ccr_send_request')}}</ion-card-title>
            <ion-card-content>
              <ion-textarea
                v-model="message"
                placeholder="Send a message"
                auto-grow
              ></ion-textarea>
            </ion-card-content>
          </ion-card>


          <ion-button expand="block" color="primary" @click="sendRequest">Abschicken</ion-button>
          <ion-button expand="block" color="medium" @click="closeRequestModal">Abbrechen</ion-button>
          
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonButton,
  IonModal,
  IonTextarea,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonSearchbar,
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/vue';
import { ref, onMounted, computed } from 'vue';

const searchQuery = ref('');
const allCarpools = ref([]);
const isLoading = ref(true);

const filteredCarpools = computed(() =>
  allCarpools.value.filter((entry) =>
    entry.joinable === 1 &&
    entry.location.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);


const showModal = ref(false);
const message = ref('');
let receiverId = null;




const openRequestModal = (targetReceiverId) => {
  receiverId = targetReceiverId;
  message.value = '';
  showModal.value = true;
};

const closeRequestModal = () => {
  showModal.value = false;
};

const sendRequest = async () => {
  const token = localStorage.getItem('token');
  if (!token || !message.value || !receiverId) return;

  try {
    const res = await fetch('http://localhost:3000/send-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        receiver_id: receiverId,
        message: message.value
      })
    });

    const data = await res.json();
    if (data.success) {
      console.log('✅ Anfrage gesendet');
      closeRequestModal();
    } else {
      console.error('❌ Fehler beim Senden:', data.message);
    }

  } catch (err) {
    console.error('❌ Netzwerkfehler:', err);
  }
};

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/search-carpools');
    const data = await res.json();

    if (res.ok && data.success) {
      allCarpools.value = data.data;
    } else {
      console.error('❌ Fehlerhafte Antwort vom Server:', data.message);
    }
  } catch (err) {
    console.error('❌ Netzwerkfehler beim Abrufen der Carpools:', err);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
});
</script>
