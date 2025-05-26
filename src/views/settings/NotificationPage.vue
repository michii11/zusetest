<template>
    <ion-page>
        <!-- Kopfleiste -->
        <ion-header>
            <ion-toolbar>
                  <div slot="secondary" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
                    <img src="/images/KZS-LOGO_Graue_Schrift.svg" alt="Konrad-Zuse-Schule" style="padding: 5px; width: 128px;">
                  </div>                  <ion-buttons slot="start">
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
import { IonPage, IonContent, IonList, IonHeader, IonToolbar, IonItem, IonButtons, IonBackButton} from '@ionic/vue';


</script>