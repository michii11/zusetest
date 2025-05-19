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
                <ion-toggle alignment="center" :checked="widgets.includes('Doener')" @click="toggleWidget('Doener')" >{{ $t("widgets_döner_title") }}</ion-toggle>
                    <ion-toggle alignment="center" :checked="widgets.includes('Messages')" @click="toggleWidget('Messages')">{{ $t("widgets_messages_title") }}</ion-toggle>
                    <ion-toggle alignment="center" :checked="widgets.includes('Contacts')"  @click="toggleWidget('Contacts')">{{ $t("widgets_contacts_title") }}</ion-toggle>
                    <ion-toggle alignment="center" :checked="widgets.includes('Mealplan')"  @click="toggleWidget('Mealplan')">Speisekarte</ion-toggle>
                    <ion-toggle alignment="center" :checked="widgets.includes('Classes')"  @click="toggleWidget('Classes')">Stundenplan</ion-toggle>
                    <ion-toggle alignment="center" :checked="widgets.includes('PT')"  @click="toggleWidget('PT')">Fahrzeiten</ion-toggle>
                    <ion-toggle alignment="center" :checked="widgets.includes('Homework')"  @click="toggleWidget('Homework')">Hausaufgaben</ion-toggle>
                    <ion-toggle alignment="center" :checked="widgets.includes('Grade')"  @click="toggleWidget('Grade')">Notenübersicht</ion-toggle>

            </ion-card>

            <ion-button @click="refreshWidgets">Speichern</ion-button>

            <ion-toast 
                :is-open="toastOpen" 
                :color="toastColor"
                :message="toastMessage" 
                duration="2000" 
                @didDismiss="toastOpen = false"/>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonToast ,IonButton ,IonPage, IonContent, IonCard, IonHeader, IonToolbar, IonToggle, IonTitle, IonBackButton, IonButtons} from '@ionic/vue';

    import {ref, onMounted} from 'vue';
    import  configTest  from '../config/config.json';
    import { useRouter } from 'vue-router';
    const toastMessage = ref('Speichern Erfolgreich!');
    const toastOpen = ref(false);
    const toastColor = ref('success');
    const router = useRouter();
    let widgets = ref([]);

    onMounted(() => {
        widgets.value = getWidgets();
        console.log(getWidgets());
    });

    const toggleWidget = (widget) => {
        let widgets = JSON.parse(localStorage.getItem('prefs_widgets')) || [];
        if(configTest.widgets.includes(widget)){
            if(widgets.includes(widget)){
                widgets.splice(widgets.indexOf(widget), 1);
            }else {
                widgets.push(widget);
            }
            localStorage.setItem('prefs_widgets', JSON.stringify(widgets));
        }
    }

    const getWidgets = () => {
        if(typeof localStorage !== "undefined"){
            const widgets = localStorage.getItem('prefs_widgets');
            return widgets ? JSON.parse(widgets) : [];
        }

        return [];
    }

    const refreshWidgets = () => {
  widgets.value = getWidgets();
  console.log(getWidgets());
  router.replace('/tabs/settings');
  setTimeout(() => {
    toastOpen.value = true;
  }, 500); // Kurze Verzögerung für bessere UX
};

</script>