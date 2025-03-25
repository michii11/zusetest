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
            <!-- Card -->
            <ion-card>
                <ion-card-header>
                    <ion-card-title>{{ $t("login")}}</ion-card-title>
                </ion-card-header>
                <ion-card-content>{{ $t("loginkey") }}</ion-card-content>
            </ion-card>

            <!-- New Card -->
            <ion-card>
                <ion-item>
                    <ion-input v-model="username" class="pw" :label="$t('username')"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-input v-model="password" class="pw" :label="$t('password')" type="password"></ion-input>
                </ion-item>
            </ion-card>

            <!-- Button Card-->
            <ion-card>
                <ion-button id="loginButton" @click="handleLogin">Login</ion-button>
                <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<script setup>
import { IonPage, IonContent, IonCard, IonCardContent, IonHeader, IonToolbar, IonCardHeader, 
    IonCardTitle, IonTitle, IonInput, IonButton, IonItem } from '@ionic/vue';
import { login } from './settings/auth.js'; // Importiere die login Funktion
import { ref } from 'vue';
import { useRouter } from 'vue-router';



const username = ref("");
const password = ref("");
const errorMessage = ref("");

const router = useRouter();

const handleLogin = async () => {
    // Ruf die Login-Funktion auf
    const response = await login(username.value, password.value);

    if (response.success) {
        // Bei Erfolg, Weiterleitung zur "Setting Page"
        console.log("✅ Login erfolgreich!");
        router.replace("/tabs/home");
    } else {
        // Fehlernachricht anzeigen
        errorMessage.value = response.message;
    }
};
</script>

<style>
#loginButton {
    width: 100%;
}
.pw {
    margin-left: 10px;
}
</style>
