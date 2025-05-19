<template>
  <ion-row>
    <ion-col>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Hausaufgaben</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <!-- Button zur Hausaufgaben-Detailseite -->
          <ion-button @click="goToHomework">
            <ion-icon :icon="bookOutline" class="icon-spacing"/>
          </ion-button>

          <!-- Vorschau: Erste Hausaufgaben -->
          <ion-list v-if="homeworkPreview.length > 0">
            <ion-item
              v-for="(entry, index) in homeworkPreview"
              :key="index"
            >
              <ion-label>
                <strong>{{ entry.subject }}:</strong> {{ entry.task }}
              </ion-label>
            </ion-item>
          </ion-list>

          <!-- Fallback -->
          <p v-else class="ion-text-center ion-margin-top">
            Keine Hausaufgaben vorhanden.
          </p>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script setup>
import {
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/vue'
import { bookOutline } from 'ionicons/icons'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

// Router
const router = useRouter()
function goToHomework() {
  router.push('/homeworkContent')
}

// Hausaufgaben-Vorschau
const homeworkPreview = ref([])

onMounted(() => {
  const stored = localStorage.getItem('homeworkData')
  if (stored) {
    const subjects = JSON.parse(stored)

    // Nur die erste Aufgabe pro Fach extrahieren
    const preview = []
    for (const subj of subjects) {
      if (subj.homeworks && subj.homeworks.length > 0) {
        preview.push({
          subject: subj.name,
          task: subj.homeworks[0]
        })
      }
    }

    // Optional: Auf max. 5 Einträge begrenzen
    homeworkPreview.value = preview.slice(0, 5)
  }
})

import { onIonViewWillEnter } from '@ionic/vue'

onIonViewWillEnter(() => {
  const stored = localStorage.getItem('homeworkData')
  if (stored) {
    const subjects = JSON.parse(stored)

    const preview = []
    for (const subj of subjects) {
      if (subj.homeworks && subj.homeworks.length > 0) {
        preview.push({
          subject: subj.name,
          task: subj.homeworks[0]
        })
      }
    }

    homeworkPreview.value = preview.slice(0, 5)
  }
})

</script>

<style scoped>
.icon-spacing {
  margin-right: 8px;
}
p {
  color: #888;
  font-style: italic;
}
</style>
