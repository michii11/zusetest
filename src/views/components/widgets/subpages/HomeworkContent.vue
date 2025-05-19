<template>
  <ion-page>
    <ion-buttons slot="start">
            <ion-back-button></ion-back-button>
        </ion-buttons>
    <ion-header>
        <ion-toolbar>
                 <ion-title>Konrad-Zuse-Schule</ion-title>
                 <ion-buttons slot="start">
                    <ion-back-button router-link="/tabs/home"></ion-back-button>
                 </ion-buttons>
            </ion-toolbar>


      <ion-toolbar color="primary">
        <ion-title>📘 Hausaufgaben-Manager</ion-title>
      </ion-toolbar>
    </ion-header>


    <ion-content class="ion-padding">

      <!-- Neues Fach hinzufügen -->
      <ion-item>
        <ion-input
          v-model="newSubject"
          placeholder="Neues Fach hinzufügen"
        ></ion-input>
        <ion-button @click="addSubject" color="success">
          Hinzufügen
        </ion-button>
      </ion-item>

      <!-- Fächerliste -->
      <ion-card v-for="(subject, index) in subjects" :key="index">
        <ion-card-header>
          <ion-card-title class="ion-text-capitalize">
            {{ subject.name }}
          </ion-card-title>
          <ion-button fill="clear" color="danger" size="small" @click="removeSubject(index)">
            Fach entfernen
          </ion-button>
        </ion-card-header>

        <!-- Neue Hausaufgabe -->
        <ion-item>
          <ion-input
            v-model="subject.newHomework"
            placeholder="Neue Hausaufgabe"
          ></ion-input>
          <ion-button @click="addHomework(index)" color="medium">
            Speichern
          </ion-button>
        </ion-item>

        <!-- Hausaufgabenliste -->
        <ion-list>
          <ion-item
            v-for="(hw, hwIndex) in subject.homeworks"
            :key="hwIndex"
          >
            <ion-label>{{ hw }}</ion-label>
            <ion-button
              fill="clear"
              color="danger"
              size="small"
              @click="removeHomework(index, hwIndex)"
            >
              ✖
            </ion-button>
          </ion-item>
        </ion-list>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonBackButton,
  IonButtons,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonLabel
} from '@ionic/vue'

import { ref, onMounted, watch } from 'vue'

// State
const newSubject = ref('')
const subjects = ref([])

// LocalStorage laden
onMounted(() => {
  const stored = localStorage.getItem('homeworkData')
  if (stored) {
    subjects.value = JSON.parse(stored)
  }
})

// LocalStorage speichern
watch(subjects, (val) => {
  localStorage.setItem('homeworkData', JSON.stringify(val))
}, { deep: true })

// Neues Fach hinzufügen
function addSubject() {
  const name = newSubject.value.trim()
  if (!name) return

  subjects.value.push({
    name,
    homeworks: [],
    newHomework: ''
  })
  newSubject.value = ''
}

// Fach entfernen
function removeSubject(index) {
  subjects.value.splice(index, 1)
}

// Neue Hausaufgabe speichern
function addHomework(subjectIndex) {
  const subj = subjects.value[subjectIndex]
  const hw = subj.newHomework.trim()
  if (!hw) return

  subj.homeworks.push(hw)
  subj.newHomework = ''
}

// Hausaufgabe entfernen
function removeHomework(subjectIndex, hwIndex) {
  subjects.value[subjectIndex].homeworks.splice(hwIndex, 1)
}

onMounted(() => {
  const stored = localStorage.getItem('homeworkData')
  if (stored) {
    subjects.value = JSON.parse(stored)
  }
})

watch(subjects, (val) => {
  localStorage.setItem('homeworkData', JSON.stringify(val))
}, { deep: true })


import { useWidgets } from '../../../utils/widgetReload'

const { getWidgets, saveWidgets } = useWidgets()

// Beispiel: Widget hinzufügen und speichern
const widgets = ref(getWidgets())

function addWidget(newWidget) {
  widgets.value.push(newWidget)
  saveWidgets(widgets.value)
}
</script>

<style scoped>
ion-card-title {
  font-size: 1.2rem;
}
</style>


