<template>
    <ion-page>
        <!-- Kopfleiste -->
        <ion-header>
            <ion-toolbar>
                 <ion-title>Konrad-Zuse-Schule</ion-title>
                 <ion-buttons slot="start">
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
    IonCardTitle, IonTitle, IonBackButton, IonButtons} from '@ionic/vue';


// Funktion, die überprüft, ob der JWT existiert und ob der Benutzer navigieren darf
const goBack = () => {
  window.history.back(); // Gehe zur vorherigen Seite im Navigationsstack zurück
};
</script>