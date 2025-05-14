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
            <ion-searchbar animated="true" placeholder="Wohnort"></ion-searchbar>

        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonSearchbar,IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton} from '@ionic/vue';


</script>