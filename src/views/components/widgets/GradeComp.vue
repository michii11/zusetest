<template>
  <ion-row>
    <ion-col>
      <ion-card @click="goToGrades" class="hover-pointer">
        <ion-card-header>
          <ion-card-title>{{ $t("grade_overview")}}</ion-card-title>
        </ion-card-header>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script setup>
import { IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle } from '@ionic/vue'
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
</style>