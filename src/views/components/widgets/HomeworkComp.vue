<template>
    <ion-row>
        <ion-col>
            <ion-card>
                <ion-card-header>
                    <ion-card-title>Hausaufgaben</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <ion-button expand="block" @click="goToHomework">Hausaufgaben</ion-button>
                </ion-card-content>
            </ion-card>
        </ion-col>
    </ion-row>
  </template>

<script setup>
import { IonRow, IonCol, IonCardContent, IonButton, IonCard, IonCardHeader, IonCardTitle} from '@ionic/vue';

import { useRouter } from 'vue-router'
const router = useRouter()

function goToHomework() {
  router.push('/homeworkContent')
}

</script>


<style scoped>
  #button{
    color: rgb(228, 229, 230);
  }
</style>