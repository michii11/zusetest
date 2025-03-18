<template>
    <ion-row>
        <ion-col>
            <ion-card>
                <ion-card-header>
                    <ion-card-title>Hausaufgaben</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <ion-button>
                    <router-link to="./HomeworkContent.vue">Go to About Page</router-link>
                  </ion-button>
                </ion-card-content>
            </ion-card>
        </ion-col>
    </ion-row>
  </template>

<script setup>
import { IonRow, IonCol, IonCardContent, IonButton, IonCard, IonCardHeader, IonCardTitle} from '@ionic/vue';
</script>

<style scoped>
  ion-card {
    --background: #080808;
    --color: #ffffff;
    margin-top: 100px;
  }

  ion-card-title {
    --color: #52ffe4;
  }

</style>