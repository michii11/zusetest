<template>
    <ion-page>
        <!-- Kopfleiste -->
        <ion-header>
            <ion-toolbar>
                  <div slot="secondary" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
                    <img src="/images/KZS-LOGO_Graue_Schrift.svg" alt="Konrad-Zuse-Schule" style="padding: 5px; width: 128px;">
                  </div>             </ion-toolbar>
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
                    <ion-input v-model="username" class="pw" :placeholder="$t('username')"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-input v-model="password" class="pw" :placeholder="$t('password')" type="password"></ion-input>
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
    IonCardTitle, IonInput, IonButton, IonItem } from '@ionic/vue';
import { login } from 'C:/Users/micha/OneDrive/Desktop/Schule/Konrad-Zuse-Schule_App/zusetest/src/views/settings/auth.js'; // Importiere die login Funktion
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
            localStorage.setItem("token", response.token);
        console.log("✅ Login erfolgreich!");
        console.log(localStorage.getItem("token"));
        router.replace("/tabs/home");
    } else {
        // Fehlernachricht anzeigen
        errorMessage.value = response.message;
    }
};


//hier neue code für admin menu

</script>

<style>
#loginButton {
    width: 100%;
}
.pw {
    margin-left: 10px;
}
</style>
