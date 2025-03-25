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
                <ion-card-header>
                    <ion-card-title>ADMIN MENU</ion-card-title>
                </ion-card-header>
                
            </ion-card>


        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonPage, IonContent, IonCard, IonHeader, IonToolbar, IonCardHeader, 
    IonCardTitle, IonTitle, IonBackButton, IonButtons} from '@ionic/vue';


</script>