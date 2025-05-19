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
                <GradeComp v-if="widgets.includes('Grade')"/>
                
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script setup>
    import { IonGrid,IonPage,IonContent, IonHeader, IonToolbar, IonTitle} from '@ionic/vue';
    import { onMounted, ref} from 'vue';

    import  configTest  from '../views/config/config.json';
import DoenerComp from './components/widgets/DoenerComp.vue';
import MealplanPage from './components/widgets/MealplanComp.vue';
import ContactPage from './components/widgets/ContactComp.vue';
import MessagePage from './components/widgets/MessageComp.vue';
import LessonPage from './components/widgets/LessonComp.vue';
import PTPage from './components/widgets/PTComp.vue';
import HomeworkPage from './components/widgets/HomeworkComp.vue';
import GradeComp from './components/widgets/GradeComp.vue';


    

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
    ion-card {
        --background: #080808;
        --color: #ffffff;
        margin-top: 100px;
    }

    ion-card-title {
        --color: #52ffe4;
    }
</style>