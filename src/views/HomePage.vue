<template>
    <ion-page>
        <!-- Kopfleiste -->
        <ion-header>
            <ion-toolbar>
                 <ion-title>Konrad-Zuse-Schule</ion-title>
            </ion-toolbar>
        </ion-header>


        <!-- Body bereich -->
        <ion-content>

            <ion-grid id="grid">
                <DoenerComp v-if="widgets.includes('Doener')" />
                <MealplanPage v-if="widgets.includes('Mealplan')"/>
                <ContactPage v-if="widgets.includes('Contacts')"/>
                <MessagePage v-if="widgets.includes('Messages')"/>
                <LessonPage v-if="widgets.includes('Classes')"/>
                <PTPage v-if="widgets.includes('PT')"/>
                <HomeworkPage v-if="widgets.includes('Homework')"/>
            </ion-grid>

        </ion-content>
    </ion-page>
   
</template>

<script setup>
import { IonGrid, IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import configData from '../views/config/config.json';


// Dynamische Komponenten
import DoenerComp from './components/widgets/DoenerComp.vue';
import MealplanPage from './components/widgets/MealplanPage.vue';
import ContactPage from './components/widgets/ContactPage.vue';
import MessagePage from './components/widgets/MessagePage.vue';
import LessonPage from './components/widgets/LessonPage.vue';
import PTPage from './components/widgets/PTPage.vue';
import HomeworkPage from './components/widgets/HomeworkPage.vue';



// Reaktive Variable für Widgets
const widgets = ref([]);



// Funktion zum Abrufen der gespeicherten Widgets
function getWidgets() {
  const defaultWidgets = configData.prefs_default_widgets;
  if (typeof localStorage !== 'undefined') {
    const storedWidgets = localStorage.getItem('prefs_widgets');
    return storedWidgets ? JSON.parse(storedWidgets) : defaultWidgets;
  }
  return defaultWidgets;
}

// Beim Laden der Seite Widgets abrufen
onMounted(() => {
  widgets.value = getWidgets();
});
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