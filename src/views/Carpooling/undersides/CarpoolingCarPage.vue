<template>
    <ion-page>
        <!-- Kopfleiste -->
        <ion-header>
            <ion-toolbar>
                 <ion-title>Konrad-Zuse-Schule</ion-title>
                 <ion-buttons slot="start">
                    <ion-back-button></ion-back-button>
                 </ion-buttons>
            </ion-toolbar>
        </ion-header>


        <!-- Body bereich -->
        <ion-content>
            <ion-card>
                <ion-card-title>Noch nicht Registriert</ion-card-title>
                <ion-card-content>
                    Stimme den Bedingungen zu, sodass dich dein Lehrer im nächsten Schritt Freigeben kann.
                    Dazu benötigst du einen gültigen Führerschein, denn du bei deinem Lehrer Vorzeigst.
                </ion-card-content>
                <ion-button @click="showModal = true">Registrieren</ion-button>
            </ion-card>

            <!-- MODAL FÜR NUTZUNGSBEDINGUNGEN -->
            <ion-modal :is-open="showModal" @didDismiss="showModal = false">
                <ion-content class="ion-padding">

                <ion-card>
                    <ion-card-title>Nutzungsbedingungen</ion-card-title>
                    <ion-card-content>
                        Bitte akzeptiere unsere Nutzungsbedingungen, um dich zu registrieren. 
                        (Hier kannst du deinen eigenen Text einsetzen - z. B. Datenschutz, Fahrregeln usw.)
                    </ion-card-content>
                </ion-card>
                <ion-button expand="block" color="success" @click="zustimmen">Zustimmen</ion-button>
                <ion-button expand="block" color="medium" @click="ablehnen">Ablehnen</ion-button>

                </ion-content>
            </ion-modal>
            
        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonModal,IonPage, IonCard, IonCardTitle, IonCardContent, IonButton, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton} from '@ionic/vue';
import { ref } from 'vue';

const showModal = ref(false);

const zustimmen = () => {
  showModal.value = false;
  // → Jetzt Registrierung starten
  console.log("✅ Zustimmung erhalten – Registrierung fortsetzen");
  // z.B. router.push("/registerform") oder Registrierung auslösen
};

const ablehnen = () => {
  showModal.value = false;
  console.log("❌ Zustimmung verweigert – Registrierung abgebrochen");
};
</script>