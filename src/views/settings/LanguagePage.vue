<template>
    <ion-page>
        <!-- Kopfleiste -->
        <ion-header>
            <ion-toolbar>
                 <ion-title>Konrad-Zuse-Schule</ion-title>
                 <ion-buttons slot="start">
                    <ion-back-button router-link="setting-page"></ion-back-button>
                 </ion-buttons>
            </ion-toolbar>
        </ion-header>


        <!-- Body bereich -->
        <ion-content>
            <ion-card>
                <ion-card-header>
                    <ion-card-title>{{ $t("languageSelection") }}</ion-card-title>
                </ion-card-header>
                <ion-list>
                  
      <!-- Selector (Dropdown), sichtbar, wenn showLanguageSelector true ist -->
       <ion-item>
        <ion-label>Sprache</ion-label>
        <ion-select v-model="selectedLanguage" @ionChange="changeLanguage">
            <ion-select-option value="de">Deutsch</ion-select-option>
            <ion-select-option value="en">Englisch</ion-select-option>
        </ion-select>
        </ion-item>
                </ion-list>
            </ion-card>


        </ion-content>
    </ion-page>
</template>

<script setup>
import {ref} from 'vue';
import { IonPage, IonLabel, IonSelect, IonSelectOption, IonContent, IonCard, IonHeader, IonToolbar, IonCardHeader, 
    IonCardTitle, IonTitle, IonBackButton, IonButtons, IonList, IonItem} from '@ionic/vue';
    import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const selectedLanguage = ref(locale.value);

const changeLanguage = (event) => {
  locale.value = event.detail.value; // Sprache wechseln
  localStorage.setItem('language', event.detail.value); // Speichern
};
/*const setLanguage = () => {
  localStorage.setItem("language", selectedLanguage.value)
}

const getLanguage = () => {
  selectedLanguage.value = localStorage.getItem("language") || "en"
}

onMounted(() => {
  getLanguage()
})*/
</script>