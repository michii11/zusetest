<template>
    <ion-row>
        <ion-col>
            <ion-card>
                <ion-card-header class="hover-pointer">
                    <ion-card-title expand="block" @click="goToGrades">Notenübersicht</ion-card-title>
                </ion-card-header>
                
            </ion-card>
        </ion-col>
    </ion-row>
  </template>

<script setup>
import { IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle} from '@ionic/vue';

import { useRouter } from 'vue-router'
const router = useRouter()

function goToGrades() {
  router.push('/gradeContent')
}

</script>


<style scoped>
    .hover-pointer {
    cursor: pointer;
    }

  #button{
    color: rgb(228, 229, 230);
  }
</style>