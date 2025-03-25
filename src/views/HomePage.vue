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
    import { IonGrid,IonPage,IonContent, IonHeader, IonToolbar, IonTitle} from '@ionic/vue';
    import { onMounted, ref} from 'vue';

    import  configTest  from 'C:/Users/micha/OneDrive/Desktop/Schule/zusetest/zusetest/src/views/config/config.json';
import DoenerComp from './components/widgets/DoenerComp.vue';
import MealplanPage from './components/widgets/MealplanPage.vue';
import ContactPage from './components/widgets/ContactPage.vue';
import MessagePage from './components/widgets/MessagePage.vue';
import LessonPage from './components/widgets/LessonPage.vue';
import PTPage from './components/widgets/PTPage.vue';
import HomeworkPage from './components/widgets/HomeworkPage.vue';

    

    let widgets = ref([]);

    onMounted(() => {
        widgets = ref(getWidgets());
        console.log(getWidgets());
    });

    const getWidgets = () => {
        const defaultWidgets = configTest.prefs_default_widgets;

        if(typeof localStorage !== "undefined"){
            const widgets = localStorage.getItem('prefs_widgets');
            return widgets ? JSON.parse(widgets) : defaultWidgets;
        }

        return defaultWidgets;
    }
</script>





<style scoped>
    ion-card-title {
        --color: #64A70B;
    }
</style>