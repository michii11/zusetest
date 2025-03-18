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
            <ion-list>
                <ion-item :button="true">test</ion-item>
            </ion-list>

        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonPage, IonContent, IonList, IonHeader, IonToolbar, IonTitle, IonItem, IonButtons, IonBackButton} from '@ionic/vue';


</script>