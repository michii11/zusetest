  <!--
 <template>
    <ion-card>
      <ion-card-header>
        <ion-card-title>Notenübersicht</ion-card-title>
        <ion-card-subtitle>Halbjahr 1</ion-card-subtitle>
      </ion-card-header>
  
      <ion-card-content>
        <ion-list>
          <ion-item v-for="subject in subjects" :key="subject.name">
            <ion-label>
              <h2>{{ subject.name }}</h2>
              <p>Noten: {{ subject.grades.join(', ') }}</p>
            </ion-label>
            <ion-badge color="primary" slot="end">
              Ø {{ calculateAverage(subject.grades).toFixed(1) }}
            </ion-badge>
          </ion-item>
        </ion-list>
  
        <ion-item lines="full">
          <ion-label><strong>Gesamtdurchschnitt</strong></ion-label>
          <ion-badge color="success" slot="end">
            {{ overallAverage.toFixed(2) }}
          </ion-badge>
        </ion-item>
      </ion-card-content>
    </ion-card>
  </template>
  
  <script setup>
  import {
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonList, IonItem, IonLabel, IonBadge
  } from '@ionic/vue'
  import { ref, computed } from 'vue'
  
  // Beispiel-Daten: Kann später aus API oder Store kommen
  const subjects = ref([
    { name: 'Mathematik', grades: [2, 3, 2] },
    { name: 'Deutsch', grades: [1, 2, 2] },
    { name: 'Englisch', grades: [3, 2, 4] },
    { name: 'Biologie', grades: [1, 1] }
  ])
  
  function calculateAverage(grades) {
    const total = grades.reduce((a, b) => a + b, 0)
    return grades.length ? total / grades.length : 0
  }
  
  const overallAverage = computed(() => {
    const allGrades = subjects.value.flatMap(s => s.grades)
    return calculateAverage(allGrades)
  })
  </script>
  
  <style scoped>
  ion-badge {
    font-size: 1rem;
  }
  </style> 
  -->
  

  <template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Konrad-Zuse-Schule</ion-title>
          <ion-buttons slot="start">
            <ion-back-button router-link="/tabs/home"></ion-back-button>
          </ion-buttons>
        </ion-toolbar>
  
        <ion-toolbar color="primary">
          <ion-title>📊 Notenübersicht</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
  
        <!-- Neues Fach -->
        <ion-item>
          <ion-input v-model="newSubject" placeholder="Neues Fach hinzufügen"></ion-input>
          <ion-button @click="addSubject" color="success">Hinzufügen</ion-button>
        </ion-item>
  
        <!-- Fachliste -->
        <ion-card v-for="(subject, index) in subjects" :key="index">
          <ion-card-header>
            <ion-card-title class="ion-text-capitalize">
              {{ subject.name }}
            </ion-card-title>
            <ion-button fill="clear" color="danger" size="small" @click="removeSubject(index)">
              Fach entfernen
            </ion-button>
          </ion-card-header>
  
          <!-- Neue Note -->
          <ion-item>
            <ion-input
              v-model.number="subject.newGrade"
              type="number"
              placeholder="Neue Note (z.B. 2)"
            ></ion-input>
            <ion-button @click="addGrade(index)" color="medium">Speichern</ion-button>
          </ion-item>
  
          <!-- Notenliste -->
          <ion-list>
            <ion-item v-for="(grade, gIndex) in subject.grades" :key="gIndex">
              <ion-label>Note: {{ grade }}</ion-label>
              <ion-button fill="clear" color="danger" size="small" @click="removeGrade(index, gIndex)">
                ✖
              </ion-button>
            </ion-item>
          </ion-list>
  
          <!-- Durchschnitt -->
          <ion-item lines="full">
            <ion-label><strong>Durchschnitt:</strong></ion-label>
            <ion-badge color="primary" slot="end">
              {{ calculateAverage(subject.grades).toFixed(2) }}
            </ion-badge>
          </ion-item>
        </ion-card>
  
        <!-- Gesamtdurchschnitt -->
        <ion-item lines="full" v-if="subjects.length">
          <ion-label><strong>Gesamtdurchschnitt</strong></ion-label>
          <ion-badge color="success" slot="end">
            {{ overallAverage.toFixed(2) }}
          </ion-badge>
        </ion-item>
  
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
    IonLabel,
    IonBadge
  } from '@ionic/vue'
  
  import { ref, onMounted, watch, computed } from 'vue'
  
  // State
  const newSubject = ref('')
  const subjects = ref([])
  
  // LocalStorage laden
  onMounted(() => {
    const stored = localStorage.getItem('gradeData')
    if (stored) {
      subjects.value = JSON.parse(stored)
    }
  })
  
  // LocalStorage speichern
  watch(subjects, (val) => {
    localStorage.setItem('gradeData', JSON.stringify(val))
  }, { deep: true })
  
  // Fach hinzufügen
  function addSubject() {
    const name = newSubject.value.trim()
    if (!name) return
  
    subjects.value.push({
      name,
      grades: [],
      newGrade: ''
    })
    newSubject.value = ''
  }
  
  // Fach entfernen
  function removeSubject(index) {
    subjects.value.splice(index, 1)
  }
  
  // Note hinzufügen
  function addGrade(subjectIndex) {
    const subj = subjects.value[subjectIndex]
    const grade = parseFloat(subj.newGrade)
    if (isNaN(grade) || grade < 1 || grade > 6) return
  
    subj.grades.push(grade)
    subj.newGrade = ''
  }
  
  // Note entfernen
  function removeGrade(subjectIndex, gradeIndex) {
    subjects.value[subjectIndex].grades.splice(gradeIndex, 1)
  }
  
  // Durchschnitt pro Fach
  function calculateAverage(grades) {
    const total = grades.reduce((a, b) => a + b, 0)
    return grades.length ? total / grades.length : 0
  }
  
  // Gesamtdurchschnitt
  const overallAverage = computed(() => {
    const allGrades = subjects.value.flatMap(s => s.grades)
    return calculateAverage(allGrades)
  })
  </script>
  
  <style scoped>
  ion-card-title {
    font-size: 1.2rem;
  }
  ion-badge {
    font-size: 1rem;
  }
  </style>
  