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

            <!-- Zweite Toolbar -->
            <ion-toolbar>
                 <ion-title>Mitfahrgelegenheit</ion-title>
            </ion-toolbar>


        </ion-header>


        <!-- Body bereich -->
        <ion-content>
            <ion-list>
                
                <!-- Eigenes Profil -->
                <ion-item :button="true" router-link="/carpooling-profile-page">
                    <ion-icon :icon="personCircleOutline" class="icon-spacing"/>
                    <ion-label>Mein Profil</ion-label>
                </ion-item>

                <!-- Mein Auto -->
                <ion-item :button="true" router-link="/carpooling-car-page">
                    <ion-icon :icon="personCircleOutline" class="icon-spacing"/>
                    <ion-label>Mein Auto</ion-label>
                </ion-item>

                <!-- Suche -->
                <ion-item :button="true" router-link="/carpooling-search-page">
                    <ion-icon :icon="personCircleOutline" class="icon-spacing"/>
                    <ion-label>Suche</ion-label>
                </ion-item>

            </ion-list>

            <!-- Bereich für Bereits bestehende Session -->
            <ion-card :button="true" router-link="/carpooling-session-page">
                <ion-card-content>
                    <ion-card-title>Aktuelle Sitzung</ion-card-title>
                    <ion-card-subtitle>Du hast keine aktuellen Mitfahrer</ion-card-subtitle>
                </ion-card-content>
            </ion-card>


        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonCardSubtitle,IonCardContent, IonCardTitle, IonCard ,IonLabel, IonIcon ,IonPage, IonContent, IonList, IonHeader, IonToolbar, IonTitle, IonItem, IonButtons, IonBackButton} from '@ionic/vue';
  import { personCircleOutline} from 'ionicons/icons';


</script>