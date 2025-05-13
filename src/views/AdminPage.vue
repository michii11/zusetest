<template>
    <ion-page>
        <!-- Kopfleiste -->
        <ion-header>
            <ion-toolbar>
                 <ion-title>Konrad-Zuse-Schule</ion-title>
                 <ion-buttons slot="start">
                    <ion-back-button router-link="setting-page"></ion-back-button>
                 </ion-buttons>
            </ion-toolbar>
        </ion-header>


        <!-- Body bereich -->
        <ion-content>
          <ion-card>  
                <!-- Eingabefeld für den Benutzernamen -->
                <ion-item>
                    <ion-label >Benutzername</ion-label>
                    <ion-input class="input" v-model="username" type="text" placeholder="Benutzernamen eingeben"></ion-input>
                </ion-item>
                <!-- Dropdown-Menü für die Auswahl der Rolle -->
                <ion-item>
                    <ion-label >Rolle auswählen</ion-label>
                    <ion-select v-model="selectedRId">
                    <ion-select-option value="1">Admin</ion-select-option>
                    <ion-select-option value="2">Teacher</ion-select-option>
                    <ion-select-option value="3">Student</ion-select-option>
                    <ion-select-option value="4">Guest</ion-select-option>
                    </ion-select>
                </ion-item>

                <!-- Button zum Senden der Anfrage -->
                <ion-button expand="full" @click="updateRId">Rolle ändern</ion-button>
            </ion-card>
                <!-- Toast-Nachricht zur Bestätigung -->
                <ion-toast 
                :is-open="toastOpen" 
                :color="toastColor"
                :message="toastMessage" 
                duration="2000" 
                @didDismiss="toastOpen = false"/>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonPage, IonContent, IonCard, IonHeader, IonToolbar, IonSelectOption, IonSelect, IonItem, IonLabel, IonToast, IonInput,
    IonButton, IonTitle, IonBackButton, IonButtons} from '@ionic/vue';
    import { ref } from 'vue';

const username = ref('');  // Speichert den Benutzernamen, dessen Rolle geändert werden soll
const selectedRId = ref(''); // Speichert die ausgewählte neue Rolle
const toastMessage = ref('');
const toastOpen = ref(false);
const toastColor = ref('');




// Funktion zum Aktualisieren der r_id
const updateRId = async () => {
  const jwt = localStorage.getItem('jwt');

  if (!jwt) {
    toastMessage.value = 'Kein Benutzer angemeldet!';
    return;
  }

  if (!username.value || !selectedRId.value) {
    toastMessage.value = 'Bitte füllen Sie alle Felder aus!';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/update-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        username: username.value,
        new_r_id: selectedRId.value,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      toastMessage.value = 'Rolle erfolgreich aktualisiert!';
      toastColor.value = 'success';
      toastOpen.value = true;
      // Eingaben zurücksetzen
      username.value = '';
      selectedRId.value = '';
    } else {
      toastMessage.value = data.message || '⚠️ Fehler beim Aktualisieren der Rolle.';
      toastColor.value = 'danger';
      toastOpen.value = true;
    }
  } catch (error) {
    console.error('Fehler:', error);
    toastMessage.value = '🚫 Serverfehler beim Senden der Anfrage.';
  }
};


</script>



<style>
.input {
  margin-left: 10px;
}

</style>