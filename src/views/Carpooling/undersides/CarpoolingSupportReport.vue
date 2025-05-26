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
import { IonSelect, IonSelectOption,IonCard, IonInput , IonCardContent, IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton} from '@ionic/vue';
import {ref} from 'vue';


const selectedMethod = ref('');



</script>