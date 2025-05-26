
  <template>
  <ion-page>
    <ion-header>
       <ion-toolbar>
<div slot="secondary" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
          <img src="/images/KZS-LOGO_Graue_Schrift.svg" alt="Konrad-Zuse-Schule" style="padding: 5px; width: 128px;">
        </div>          <ion-buttons slot="start">
            <ion-back-button router-link="/tabs/home"></ion-back-button>
          </ion-buttons>
        </ion-toolbar>

      <ion-toolbar color="primary">
        <ion-title>{{ $t('grades_title_view') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Neues Fach -->
      <ion-item>
        <ion-input v-model="newSubject" :placeholder="$t('grades_new_subject_placeholder')"></ion-input>
        <ion-button @click="addSubject" color="success">{{ $t('grades_button_add') }}</ion-button>
      </ion-item>

      <!-- Fachliste -->
      <ion-card v-for="(subject, index) in subjects" :key="index">
        <ion-card-header>
          <ion-card-title class="ion-text-capitalize">
            {{ subject.name }}
          </ion-card-title>
          <ion-button fill="clear" color="danger" size="small" @click="removeSubject(index)">
            {{ $t('grades_button_remove_subject') }}
          </ion-button>
        </ion-card-header>

        <!-- Neue Note -->
        <ion-item>
          <ion-input
            v-model.number="subject.newGrade"
            type="number"
            :placeholder="$t('grades_new_grade_placeholder')"
          ></ion-input>
          <ion-button @click="addGrade(index)" color="medium">{{ $t('grades_button_save') }}</ion-button>
        </ion-item>

        <!-- Notenliste -->
        <ion-list>
          <ion-item v-for="(grade, gIndex) in subject.grades" :key="gIndex">
            <ion-label>{{ $t('grades_label_grade') }}: {{ grade }}</ion-label>
            <ion-button fill="clear" color="danger" size="small" @click="removeGrade(index, gIndex)">
              {{ $t('grades_button_remove_grade') }}
            </ion-button>
          </ion-item>
        </ion-list>

        <!-- Durchschnitt -->
        <ion-item lines="full">
          <ion-label><strong>{{ $t('grades_label_average') }}:</strong></ion-label>
          <ion-badge color="primary" slot="end">
            {{ calculateAverage(subject.grades).toFixed(2) }}
          </ion-badge>
        </ion-item>
      </ion-card>

      <!-- Gesamtdurchschnitt -->
      <ion-item lines="full" v-if="subjects.length">
        <ion-label><strong>{{ $t('grades_label_overall_average') }}</strong></ion-label>
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
  