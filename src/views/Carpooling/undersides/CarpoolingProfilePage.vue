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
            <ion-card>
                <ion-card-title>Vorname, Nachname</ion-card-title>
                <ion-card-content>
                    

                <ion-card v-if="showRegistrationCard">
                <ion-card-title>Nutzungsbedingungen zustimmen und Daten Ergänzen</ion-card-title>
                <ion-card-content>
                    Stimme den Richtlinien zu und ergänze deine Restlichen Daten.
                    Andere Schüler werden diese dann am Ende sehen.
                </ion-card-content>
                <ion-button @click="showModal = true">Registrieren</ion-button>
            </ion-card>

            <!-- MODAL FÜR NUTZUNGSBEDINGUNGEN -->
            <ion-modal :is-open="showModal" @didDismiss="showModal = false">
                <ion-content class="ion-padding">
                    <ion-header>
                    <ion-toolbar>
                        <ion-title>Benutzerinfo eingeben</ion-title>
                        <ion-buttons slot="end">
                        <ion-button @click="closeModal">Schließen</ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                    </ion-header>

                    <ion-content class="ion-padding">
                    <ion-item>
                    <ion-label>Geburtstag (TT.MM.JJJJ)</ion-label>
                    <ion-input
                        v-model="birthday"
                        placeholder="z.B. 15.05.1990"
                        maxlength="10"
                        @input="validateDate"
                    ></ion-input>
                    </ion-item>
                    <p v-if="dateError" style="color:red; font-size: 0.8em;">Bitte gültiges Datum im Format TT.MM.JJJJ eingeben</p>

                    <ion-item>
                        <ion-label >Wohnort</ion-label>
                        <ion-input v-model="city" placeholder="Wohnort eingeben"></ion-input>
                    </ion-item>

                    <ion-item>
                        <ion-label >PLZ</ion-label>
                        <ion-input v-model="postalCode" type="number" placeholder="Postleitzahl"></ion-input>
                    </ion-item>

                <ion-button expand="block" color="success" @click="zustimmen">Zustimmen & Speichern</ion-button>
                <ion-button expand="block" color="medium" @click="ablehnen">Ablehnen</ion-button>

                </ion-content>
            </ion-content>
            </ion-modal>











                </ion-card-content>
            </ion-card>
            
        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonItem, IonLabel, IonInput  ,IonModal,IonButton,IonPage, IonCard, IonCardTitle, IonCardContent, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton} from '@ionic/vue';
import { ref } from 'vue';


const showModal = ref(false);
const showRegistrationCard = ref(true);

const zustimmen = () => {
  showModal.value = false;
  // → Jetzt Registrierung starten
  console.log("✅ Zustimmung erhalten - Registrierung fortsetzen");
  // z.B. router.push("/registerform") oder Registrierung auslösen
};

const ablehnen = () => {
  showModal.value = false;
  console.log("❌ Zustimmung verweigert - Registrierung abgebrochen");
};

</script>