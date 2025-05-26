<template>
    <ion-page>
        <!-- Kopfleiste -->
        <ion-header>
            <ion-toolbar>
<div slot="secondary" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
          <img src="/images/KZS-LOGO_Graue_Schrift.svg" alt="Konrad-Zuse-Schule" style="padding: 5px; width: 128px;">
        </div>                 <ion-buttons slot="start">
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

            <ion-card>
                <ion-label>Dark Mode</ion-label>
                <ion-toggle :checked="isDark" @ionChange="toggleTheme"></ion-toggle>
            </ion-card>


        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonLabel ,IonPage, IonContent, IonCard, IonHeader, IonToolbar, IonToggle, IonBackButton, IonButtons} from '@ionic/vue';

    import {ref, onMounted} from 'vue';
    import  configTest  from '../config/config.json';
    let widgets = ref([]);
    const isDark = ref(false);
    onMounted(() => {
        widgets.value = getWidgets();
        console.log(getWidgets());
        const saved = localStorage.getItem('dark-mode');
        isDark.value = saved === 'true';
        document.body.classList.toggle('dark', isDark.value);
        });

        function toggleTheme(event) {
        isDark.value = event.detail.checked;
        document.body.classList.toggle('dark', isDark.value);
        localStorage.setItem('dark-mode', isDark.value);
        }

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




    

</script>