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
                <ion-card-content>
                <ion-select v-model="selectedMethod" placeholder="Bitte auswählen">
                    <ion-select-option value="report">Report</ion-select-option>
                    <ion-select-option value="support">Support</ion-select-option>
                </ion-select>
                </ion-card-content>
                
            </ion-card>
            <ion-content v-if="selectedMethod === 'report'">
                <ion-select placeholder="Bitte auswählen">
                    <ion-select-option value="userA">Benutzer A</ion-select-option>
                    <ion-select-option value="userB">Benutzer B</ion-select-option>
                </ion-select>
            </ion-content>
            <ion-content v-if="selectedMethod === 'support'">
                <ion-input label="Bitte Problem Beschreiben"></ion-input>
            </ion-content>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonSelect, IonSelectOption,IonCard, IonInput , IonCardContent, IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton} from '@ionic/vue';
import {ref} from 'vue';


const selectedMethod = ref('');



</script>