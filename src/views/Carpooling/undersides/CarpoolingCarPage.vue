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




    <!-- Body bereich -->
    <ion-content>
      <div v-if="loading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
      </div>

      


      <div v-else-if="showRegistrationCard === true">
        <!-- Registrierungskarte -->
        <ion-card>
          <ion-card-title>{{ $t('ccr_not_registered') }}</ion-card-title>
          <ion-card-content>
            {{ $t('ccr_please_agree') }}
          </ion-card-content>
          <ion-button @click="showModal = true">{{ $t('ccr_register') }}</ion-button>
        </ion-card>
      </div>

      <div v-else>


            <ion-refresher slot="fixed" @ionRefresh="refreshWidgets">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
        <!-- Fahrzeugdatenkarte -->
        <ion-card>
          <ion-card-content>
          <ion-card-title>{{$t('ccr_vehicle_data')}}
          <ion-button class="button" @click="openEditModal">{{$t('ccr_edit')}}</ion-button></ion-card-title>
          <br>
          <ion-card-title>{{$t('ccr_visibility')}}
            <ion-toggle
            v-model="visible"
            @ionChange="toggleVisibility"
            :disabled="isGroupFull"
          ></ion-toggle>
          </ion-card-title>
          </ion-card-content>
        </ion-card>

        

        <ion-modal :is-open="isEditModalOpen">
          <ion-content>
            <ion-card>
              <ion-card-title>{{$t('ccr_vehicle_data')}}</ion-card-title>
              <ion-input v-model="editSeats" type="number" placeholder="Sitzplätze ohne Fahrer"></ion-input>
              <ion-select v-model="editFuelId" placeholder="Bitte Antrieb auswählen">
                <ion-select-option value="1">{{$t('ccr_diesel')}}</ion-select-option>
                <ion-select-option value="2">{{$t('ccr_gasoline')}}</ion-select-option>
                <ion-select-option value="3">{{$t('ccr_electric')}}</ion-select-option>
                <ion-select-option value="4">{{$t('ccr_gas')}}</ion-select-option>
                <ion-select-option value="5">{{$t('ccr_hybrid')}}</ion-select-option>
                <ion-select-option value="6">{{$t('ccr_plug_in_hybrid')}}</ion-select-option>
              </ion-select>
            </ion-card>

            <ion-card>
              <ion-card-title>{{$t('ccr_route_data')}}</ion-card-title>
              <ion-input v-model="editLocation" placeholder="Zielort"></ion-input>
              <ion-input v-model="editPostalCode" type="number" placeholder="PLZ"></ion-input>
            </ion-card>

            <ion-button expand="block" color="success" @click="saveEditChanges">{{$t('grades_button_save')}}</ion-button>
            <ion-button expand="block" color="medium" @click="cancelEditModal">{{$t('cancel')}}</ion-button>
          </ion-content> 
        </ion-modal>

        <ion-card>
          <ion-card-content>
          <ion-card-title>{{$t('ccr_group_members')}}</ion-card-title>
          <br>
          <ion-list>
            <ion-item
              v-for="user in groupMembers"
              :key="user.id"
              :class="{ 'is-current-user': user.id === currentUserId }"
              :button="user.id !== currentUserId"
              @click="user.id !== currentUserId && confirmRemoveUser(user)"
            >
              {{ user.firstname }} {{ user.lastname }} {{ user.mail }}
            </ion-item>
          </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- Bestätigungsmodal -->
        <ion-alert
          :is-open="showRemoveConfirm"
          header="Benutzer entfernen"
          message="Möchtest du diesen Benutzer wirklich aus der Gruppe entfernen?"
          :buttons="[
            { text: 'Abbrechen', role: 'cancel', handler: () => showRemoveConfirm = false },
            { text: 'Entfernen', role: 'destructive', handler: () => removeUser() }
          ]"
        />




        <ion-card>
          <ion-card-content>
          <ion-card-title>{{$t('ccr_requests')}}</ion-card-title>
          <br>
          <ion-list>
            <ion-item
              v-for="request in requests"
              :key="request.request_id"
              button
              @click="openActionSheet(request)"
            >
              <ion-label>
                {{ request.firstname }} {{ request.lastname }} <br/>
                "{{ request.message }}"
              </ion-label>
            </ion-item>
          </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-content>
            <ion-button class="button" color="danger" @click="presentAlert">{{ $t('ccr_delete_group') }}</ion-button>
          </ion-card-content>
        </ion-card>
        

        <ion-alert
          :is-open="showAlert"
          header="Delete group"
          message="Do you really want to delete the group? This action cannot be undone."
          :buttons="alertButtons"
          @didDismiss="showAlert = false"
        />
      </div>




      <!-- Nutzungsbedingungen Modal -->
      <ion-modal :is-open="showModal" @didDismiss="showModal = false">
        <ion-content class="ion-padding">
          <ion-card>
            <ion-card-content>
              <ion-card-title>{{ $t('ccr_agree_terms') }}</ion-card-title>
                {{ $t('ccr_agree_terms_text') }}  
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-title>{{ $t('ccr_vehicle_data') }}</ion-card-title>
            <ion-input v-model="seats" type="number" placeholder="Sitzplätze ohne Fahrer"></ion-input>
            <ion-select v-model="selectFuelId" placeholder="Bitte Antrieb auswählen">
              <ion-select-option value="1">{{ $t('ccr_diesel') }}</ion-select-option>
              <ion-select-option value="2">{{ $t('ccr_gasoline') }}</ion-select-option>
              <ion-select-option value="3">{{ $t('ccr_electric') }}</ion-select-option>
              <ion-select-option value="4">{{ $t('ccr_gas') }}</ion-select-option>
              <ion-select-option value="5">{{ $t('ccr_hybrid') }}</ion-select-option>
              <ion-select-option value="6">{{ $t('ccr_plug_in_hybrid') }}</ion-select-option>
            </ion-select>
          </ion-card>

          <ion-card>
            <ion-card-title>{{ $t('ccr_route_data') }}</ion-card-title>
            <ion-input v-model="location" placeholder="Zielort"></ion-input>
            <ion-input v-model="postalCode" type="number" placeholder="PLZ"></ion-input>
          </ion-card>

          <ion-button expand="block" color="success" @click="zustimmen">{{ $t('ccr_agree_save') }}</ion-button>
          <ion-button expand="block" color="medium" @click="ablehnen">{{ $t('cancel') }}</ion-button>
        </ion-content>
      </ion-modal>

      <!-- ActionSheet -->
      <ion-action-sheet
        :is-open="actionSheetOpen"
        :header="`Anfrage von ${selectedRequest?.firstname || ''} ${selectedRequest?.lastname || ''}`"
        :buttons="[
          {
            text: 'Accept',
            handler: () => handleRequest('accept')
          },
          {
            text: 'Reject',
            role: 'destructive',
            handler: () => handleRequest('decline')
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]"
        @did-dismiss="actionSheetOpen = false"
      ></ion-action-sheet>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonRefresher,
  IonRefresherContent,
  IonAlert,
  IonLabel,
  IonList,
  IonItem,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonModal,
  IonPage,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonActionSheet
} from '@ionic/vue';
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const showModal = ref(false);
const showRegistrationCard = ref(true);
const loading = ref(true);

const router = useRouter();

const seats = ref('');
const selectFuelId = ref('');
const postalCode = ref('');
const location = ref('');
const visible = ref(true);
const requests = ref([]);

const actionSheetOpen = ref(false);
const selectedRequest = ref(null);
const groupInfo = ref({});
const refreshWidgets = async (event) => {
  try {
    // Hier deine Lade-Logik
    await loadRequests(), loadGroupMembers();// Beispiel: neu laden
  } catch (error) {
    console.error('❌ Fehler beim Refresh:', error);
  } finally {
    event.detail.complete(); // WICHTIG: Spinner stoppen
  }
};

const isGroupFull = computed(() => {
  if (!groupInfo.value) return false;
  return groupInfo.value.members >= groupInfo.value.capacity;
});


// visible steuert den Ion-Toggle


// Wenn sich der Füllstatus der Gruppe ändert:
watch(isGroupFull, async (full) => {
  if (full) {
    visible.value = false;
    await forceDisableVisibility(); // nur abschalten
  }
});

// Nur bei voller Gruppe: Sichtbarkeit deaktivieren (joinable = 0)
const forceDisableVisibility = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/update-visibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ visible: false }), // direkt false
    });

    const result = await res.json();
    if (!result.success) {
      console.error('Fehler beim Erzwingen von "nicht joinable":', result.message);
    }
  } catch (err) {
    console.error('Netzwerkfehler beim Erzwingen von Sichtbarkeit:', err);
  }
};



const loadGroupInfo = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const res = await fetch('http://localhost:3000/group-info', {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  if (res.ok && data.success) {
    groupMembers.value = data.data;
    currentUserId.value = data.currentUserId;

    const owner = data.data.find((u) => u.seats !== null);
    if (owner) {
      const totalFreeSeats = owner.seats; // Nur 1 Fahrer mit seats

      groupInfo.value = {
        location: owner.location,
        postcode: owner.postcode,
        seats: totalFreeSeats,
        f_id: owner.f_id,
        capacity: totalFreeSeats + 1, // Fahrer selbst dazuzählen
        members: data.data.length        // aktuelle Belegung
      };
    }
  }
};





const loadRequests = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/my-requests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      requests.value = data.data;
    }
  } catch (err) {
    console.error('Fehler beim Laden der Anfragen:', err);
  }
};

const openActionSheet = (request) => {
  selectedRequest.value = request;
  actionSheetOpen.value = true;
};

const showAlert = ref(false);

const alertButtons = [
  {
    text: 'Abbrechen',
    role: 'cancel',
    handler: () => {
      showAlert.value = false;
    },
  },
  {
    text: 'Löschen',
    role: 'destructive',
    handler: () => {
      deleteGroup(); // Hier deine Funktion aufrufen
    },
  },
];

function presentAlert() {
  showAlert.value = true;
}




const editSeats = ref(0);
const editFuelId = ref('');
const editLocation = ref('');
const editPostalCode = ref('');
const isEditModalOpen = ref(false);

async function openEditModal() {
  isEditModalOpen.value = true;

  const res = await fetch('http://localhost:3000/get-car-data', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const data = await res.json();
  if (data.success) {
    editSeats.value = data.data.seats;
    editFuelId.value = String(data.data.f_id);
    editLocation.value = data.data.location;
    editPostalCode.value = data.data.postcode;
  }
}

async function saveEditChanges() {
  const res = await fetch('http://localhost:3000/update-car-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      seats: editSeats.value,
      f_id: editFuelId.value,
      location: editLocation.value,
      postcode: editPostalCode.value,
    }),
  });

  const data = await res.json();
  if (data.success) {
    isEditModalOpen.value = false;
    console.log('✅ Fahrzeugdaten erfolgreich aktualisiert.');
  } else {
    console.error('❌ Fehler beim Speichern:', data.message);
  }
}

function cancelEditModal() {
  isEditModalOpen.value = false;
}


const handleRequest = async (action) => {
  if (!selectedRequest.value) return;

  const token = localStorage.getItem('token');
  if (!token) return;

  const bodyPayload = { 
    request_id: selectedRequest.value.request_id, 
    sender_id: selectedRequest.value.sender_id,
    action
  };

  try {
    const res = await fetch('http://localhost:3000/handle-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bodyPayload)
    });

    const data = await res.json();
    if (data.success) {
      actionSheetOpen.value = false;
      await loadRequests(), loadGroupMembers(), loadVisibility(),toggleVisibility();
    } else {
      console.error('Fehler beim Verarbeiten der Anfrage:', data.message);
    }
  } catch (err) {
    console.error('Netzwerkfehler beim Verarbeiten der Anfrage:', err);
  }
};

const ablehnen = () => {
  showModal.value = false;
  console.log("❌ Zustimmung verweigert - Registrierung abgebrochen");
};


const deleteGroup = async () => {

  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/delete-group', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok && data.success) {
      router.replace('/tabs/carpooling'); // oder zu einer anderen Seite weiterleiten
    } else {
      alert('❌ Fehler: ' + data.message);
    }
  } catch (err) {
    console.error('❌ Netzwerkfehler:', err);
  }
};





const zustimmen = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('⚠️ Kein Token gefunden.');
    return;
  }

  const payload = {
    f_id: selectFuelId.value,
    seats: seats.value,
    location: location.value,
    postcode: postalCode.value
  };
  console.log('📦 Payload:', payload);
  try {
    const res = await fetch('http://localhost:3000/register-car', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (res.ok) {
      console.log('✅ Erfolgreich gespeichert:', result);
      showModal.value = false;
      showRegistrationCard.value = false;
    } else {
      console.error('❌ Fehler beim Speichern:', result.message);
    }
  } catch (err) {
    console.error('❌ Netzwerkfehler:', err);
  }
};

const groupMembers = ref([]);
const currentUserId = ref(null);
const userToRemove = ref(null);
const showRemoveConfirm = ref(false);

const loadGroupMembers = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/group-members', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    if (res.ok && data.success) {
      groupMembers.value = data.data;
      // currentUserId aus Token holen oder vom Backend (hier einfach als Beispiel)
      // Du kannst auch eine separate API nutzen, um Userdaten zu holen
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserId.value = payload.id;
    } else {
      console.error('Fehler beim Laden der Gruppenmitglieder:', data.message);
    }
  } catch (error) {
    console.error('Netzwerkfehler beim Laden der Gruppenmitglieder:', error);
  }
};

const confirmRemoveUser = (user) => {
  userToRemove.value = user;
  showRemoveConfirm.value = true;
  loadVisibility(), toggleVisibility();
};

const removeUser = async () => {
  if (!userToRemove.value) return;
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/remove-from-group', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ userIdToRemove: userToRemove.value.id })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Aktualisiere die Liste nach dem Entfernen
      await loadGroupMembers(), loadVisibility(), toggleVisibility();
      showRemoveConfirm.value = false;
    } else {
      console.error('Fehler beim Entfernen:', data.message);
    }
  } catch (err) {
    console.error('Netzwerkfehler beim Entfernen:', err);
  }
};

onMounted(async () => {
  await loadRequests();
  const token = localStorage.getItem('token');
  if (!token) return;

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  try {
    const res = await fetch('http://localhost:3000/check-agreed-terms', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (data.driver_agreed_terms === 1) {
      console.log("✅ Zustimmung liegt vor");
      showRegistrationCard.value = false;
    } else {
      console.log("🟡 Noch keine Zustimmung");
    }
  } catch (err) {
    console.error('❌ Fehler beim Abrufen von driver_agreed_terms:', err);
  }

  loadVisibility();
  toggleVisibility();
  loadGroupMembers();
  loadGroupInfo();

  await delay(200);
  loading.value = false;
});






const loadVisibility = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/get-visibility', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (data.success) {
      visible.value = !!data.visible; // ← DB liefert 0 oder 1
    }
  } catch (err) {
    console.error('Fehler beim Laden der Sichtbarkeit:', err);
  }
};

const toggleVisibility = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/update-visibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ visible: visible.value })
    });

    const result = await res.json();
    if (!result.success) {
      console.error('Fehler beim Speichern:', result.message);
    }
  } catch (err) {
    console.error('Netzwerkfehler:', err);
  }
};


</script>





<style scoped>
 .icon-spacing {
    margin-right: 2vw;
  }


.loading-container {
  text-align: center;
  margin-top: 20px;
}

.is-current-user {
  color: red;
  pointer-events: none; /* nicht anklickbar */
  user-select: none;
}

.button {
  width: 100%;
}
</style>