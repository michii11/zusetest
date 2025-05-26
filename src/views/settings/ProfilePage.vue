<template>
    <ion-page>
        <!-- Kopfleiste -->
        <ion-header>
            <ion-toolbar>
                  <div slot="secondary" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
                    <img src="/images/KZS-LOGO_Graue_Schrift.svg" alt="Konrad-Zuse-Schule" style="padding: 5px; width: 128px;">
                  </div>                  <ion-buttons slot="start">
                    <ion-back-button  @click="goBack()"></ion-back-button>
                 </ion-buttons>
            </ion-toolbar>
        </ion-header>


        <!-- Body bereich -->
        <ion-content>
            <ion-card>
                <ion-card-header>
                    <ion-card-title>About You</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <h2>vorname.nachname@konrad-zuse-schule.de</h2>
                </ion-card-content>
            </ion-card>


        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonPage, IonContent, IonCard, IonCardContent, IonHeader, IonToolbar, IonCardHeader, 
    IonCardTitle, IonBackButton, IonButtons} from '@ionic/vue';


// Funktion, die überprüft, ob der JWT existiert und ob der Benutzer navigieren darf
const goBack = () => {
  window.history.back(); // Gehe zur vorherigen Seite im Navigationsstack zurück
};
</script>