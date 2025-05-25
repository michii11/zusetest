<template>
  <ion-page>
    <!-- Kopfleiste -->
    <ion-header>
      <ion-toolbar>
            <img src="/images/KZS-LOGO_Graue_Schrift.svg" alt="Konrad-Zuse-Schule" width="128px" style="padding: 5px;">
      </ion-toolbar>
    </ion-header>

    <ion-content>


      <ion-refresher slot="fixed" @ionRefresh="refreshWidgets">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Ladeanzeige -->
      <div v-if="loading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
      </div>

      <!-- Nach dem Laden -->
      <div v-else>
        <ion-card v-if="showRegistrationCard">
          <ion-card-title>Nutzungsbedingungen zustimmen</ion-card-title>
          <ion-card-content>
            Stimme den Richtlinien zu und ergänze deine restlichen Daten.
            Andere Schüler werden diese dann am Ende sehen.
            <ion-button expand="block" color="success" @click="zustimmen">Zustimmen & Speichern</ion-button>
          </ion-card-content>
        </ion-card>

        <div v-else>
          <ion-list>
            <!--<ion-item :button="true" router-link="/carpooling-profile-page">
              <ion-icon :icon="personCircleOutline" class="icon-spacing"/>
              <ion-label>Mein Profil</ion-label>
            </ion-item>-->

            <ion-item v-if="isDriver && isInGroup || !isInGroup" :button="true" router-link="/carpooling-car-page">
              <ion-icon :icon="carOutline" class="icon-spacing"/>
              <ion-label>Fahrten & Auto Managment</ion-label>
            </ion-item>

            <ion-item v-if="!isInGroup" :button="true" router-link="/carpooling-search-page">
              <ion-icon :icon="search" class="icon-spacing"/>
              <ion-label>Suche</ion-label>
            </ion-item>

            <!--<ion-item :button="true" router-link="/carpooling-support-report">
              <ion-icon :icon="constructOutline" class="icon-spacing"/>
              <ion-label>Support & Report</ion-label>
            </ion-item>-->
          </ion-list>

          <!--<ion-card :button="true" router-link="/carpooling-chat">
            <ion-card-content>
              <ion-card-title>Aktuelle Sitzung</ion-card-title>
              <ion-card-subtitle>Du hast keine aktuellen Mitfahrer</ion-card-subtitle>
            </ion-card-content>
          </ion-card>-->


          <ion-card v-if="groupMembers.length">
            <ion-card-header>
              <ion-card-title>Deine Gruppe</ion-card-title>
              <ion-card-subtitle>{{ groupInfo.location }} – {{ groupInfo.postcode }}</ion-card-subtitle>
            </ion-card-header>

            <ion-card-content>
              <ion-list>
                <ion-item v-for="member in groupMembers" :key="member.id">
                  <ion-label>
                    {{ member.firstname }} {{ member.lastname }}
                    <span v-if="member.id === currentUserId" style="color: red;"> (Du)</span>
                  </ion-label>
                </ion-item>
              </ion-list>

              <ion-text class="block my-2">
                <strong>Belegung:</strong> {{ groupInfo.members }} / {{ groupInfo.capacity }}
              </ion-text>

              <ion-text>
                <p><strong>Antrieb:</strong> {{ fuelName(groupInfo.f_id) }}</p>
                <p><strong>Sitzplätze:</strong> {{ groupInfo.seats + 1}}</p>
              </ion-text>

              <ion-button expand="block" color="primary" router-link="/carpooling-chat">
                Zum Gruppen-Chat
              </ion-button>

              <ion-button
                expand="block"
                color="danger"
                @click="leaveCarpool"
                v-if="!isGroupOwner"
              >
                Gruppe verlassen
              </ion-button>
            </ion-card-content>
          </ion-card>

          <ion-card v-else>
            <ion-card-content>
              <ion-card-title>Du bist in keiner Gruppe</ion-card-title>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup>
import {   IonRefresher, IonRefresherContent,IonCardHeader,IonText,IonSpinner,IonButton, IonCardSubtitle,IonCardContent, IonCardTitle, IonCard ,IonLabel, IonIcon ,IonPage, IonContent, IonList, IonHeader, IonToolbar, IonItem} from '@ionic/vue';
  import { carOutline, search} from 'ionicons/icons';
import { ref, onMounted, computed } from 'vue';

const showRegistrationCard = ref(true);
const loading = ref(true);
const isInGroup = ref(false);



const checkGroupStatus = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/check-group', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.success) {
      isInGroup.value = data.inGroup;
    }
  } catch (err) {
    console.error('Fehler beim Laden des Gruppenstatus:', err);
  }
};




const refreshWidgets = async (event) => {
  try {
    // Hier deine Lade-Logik
    await window.location.reload();// Beispiel: neu laden
  } catch (error) {
    console.error('❌ Fehler beim Refresh:', error);
  } finally {
    event.detail.complete(); // WICHTIG: Spinner stoppen
  }
};


const zustimmen = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/agree-passenger-terms', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    console.log(data.message);

    if (res.ok) {
      showRegistrationCard.value = false;
    }

  } catch (err) {
    console.error('❌ Fehler beim Zustimmen:', err);
  }
};


const isDriver = ref(false);

const groupMembers = ref([]);
const currentUserId = ref(null);
const groupInfo = ref({});

const fuelName = (id) => {
  const fuelMap = {
    1: 'Diesel',
    2: 'Benzin',
    3: 'Elektrisch',
    4: 'Gas',
    5: 'Hybrid',
    6: 'Plug-in-Hybrid'
  };
  return fuelMap[id] || 'Unbekannt';
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

const isGroupOwner = computed(() => {
  // Falls ein Mitglied seats hat (Fahrer), ist er Owner
  const owner = groupMembers.value.find(member => member.seats !== null);
  return owner?.id === currentUserId.value;
});

const leaveCarpool = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/leave-carpool', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (res.ok && data.success) {
      console.log('🚪 Gruppe verlassen');
      // Optional: Weiterleitung oder Reload
      window.location.reload();
    } else {
      console.error('❌ Fehler:', data.message);
    }
  } catch (err) {
    console.error('❌ Netzwerkfehler:', err);
  }
};

onMounted(async () => {
  console.log(isInGroup.value);
  const token = localStorage.getItem('token');
  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  
  if (!token) return;

  try {
    const res = await fetch('http://localhost:3000/get-passenger-terms', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error(`Serverfehler: ${res.status}`);

    const data = await res.json();
    console.log('✅ passenger_agreed_terms:', data.passenger_agreed_terms);

    if (data.passenger_agreed_terms === 1) {
        console.log("Test");
      showRegistrationCard.value = false;
    }

  } catch (err) {
    console.error('❌ Fehler beim Abrufen von passenger_agreed_terms:', err);
  }


  try {
    const token = localStorage.getItem('token'); // oder wo auch immer du den JWT speicherst
    const res = await fetch('http://localhost:3000/is-driver', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok && data.success) {
      isDriver.value = data.isDriver;
    } else {
      console.error('❌ Fehlerhafte Antwort:', data.message);
    }
  } catch (err) {
    console.error('❌ Netzwerkfehler beim Abrufen des Fahrerstatus:', err);
  }





  checkGroupStatus();
  loadGroupInfo();
  await delay(200);  // mindestens 500ms warten
  loading.value = false;
  console.log(loading.value);
});






</script>

<style scoped>
 .icon-spacing {
    margin-right: 2vw;
  }


.loading-container {
  text-align: center;
  margin-top: 20px;
}

.icon {
  display: flex; 
  align-items:  center; 
  justify-content: center;
}
</style>