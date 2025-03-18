<template>
    <ion-page>
      <!-- Kopfleiste -->
      <ion-header>
        <ion-toolbar>
          <ion-title>Konrad-Zuse-Schule</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <!-- Body Bereich -->
      <ion-content>
        <ion-list lines="full">
          <!-- Item-Profile -->
          <ion-item :button="true" router-link="/profile-page">
            <ion-icon :icon="personCircleOutline" class="icon-spacing"/>
            <ion-label>{{ $t("profile")}}</ion-label>
          </ion-item>
  
          <!-- Item-Benachrichtigungen -->
          <ion-item :button="true" router-link="/notification-page">
            <ion-icon :icon="notificationsOutline" class="icon-spacing"/>
            <ion-label>{{ $t("notification")}}</ion-label>
          </ion-item>
  
          <!-- Item-Sprache -->
          <ion-item :button="true" router-link="/language-page">
            <ion-icon :icon="languageOutline" class="icon-spacing"/>
            <ion-label>{{ $t("language")}}</ion-label>
          </ion-item>
  
          <!-- Item-Design -->
          <ion-item :button="true" router-link="/design-page">
            <ion-icon :icon="invertModeOutline" class="icon-spacing"/>
            <ion-label>{{ $t("design")}}</ion-label>
          </ion-item>
  
          <!-- Item-Datenschutz -->
          <ion-item :button="true" router-link="/safety-page">
            <ion-icon :icon="shieldCheckmarkOutline" class="icon-spacing"/>
            <ion-label>{{ $t("safety")}}</ion-label>
          </ion-item>
  
          <!-- Item-info -->
          <ion-item :button="true" router-link="/info-page">
            <ion-icon :icon="informationCircleOutline" class="icon-spacing"/>
            <ion-label>{{ $t("information")}}</ion-label>
          </ion-item>
  
          <!-- Item-Hilfe -->
          <ion-item :button="true" router-link="/help-page">
            <ion-icon :icon="helpCircleOutline" class="icon-spacing"/>
            <ion-label>{{ $t("feedback")}}</ion-label>
          </ion-item>
  
          <!-- Item-Abmelden -->
          <ion-item :button="true" @click="showActionSheet = true">
            <ion-icon :icon="logOutOutline" class="icon-spacing"/>
            <ion-action-sheet
              :is-open="showActionSheet"
              @didDismiss="showActionSheet = false"
              :header="$t('sure')"
              :buttons="actionButtons"
            ></ion-action-sheet>
            <ion-label>{{ $t("logout")}}</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref, getCurrentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  import { IonPage, IonIcon, IonContent, IonList, IonItem, IonLabel, IonActionSheet, IonHeader, IonToolbar, IonTitle } from '@ionic/vue';
  
  import { helpCircleOutline, informationCircleOutline, invertModeOutline, languageOutline, logOutOutline, notificationsOutline, personCircleOutline, shieldCheckmarkOutline } from 'ionicons/icons';



  const instance = getCurrentInstance();
const t = instance.appContext.config.globalProperties.$t;
  const router = useRouter();
  
  // Action Sheet Steuerung
  const showActionSheet = ref(false);
  
  // Die Buttons des Action Sheets
  const actionButtons = [
{
    text: t('logout'),
    role: 'destructive',
    handler: () => {
      handleLogout();
    },
    },
    {
      text: t('cancel'),
      role: 'cancel',
      handler: () => {
        console.log("Abmeldung abgebrochen.");
      },
    },
  ];
  
  // Funktion für den Logout
  const handleLogout = () => {
    // JWT Token aus dem LocalStorage entfernen
    localStorage.removeItem("jwt");
  
    // Weiterleitung zur Login-Seite
    router.replace("/login-page");
  };
  </script>
  
 
 <style scoped>

  .icon-spacing {
    margin-right: 2vw;
  }

  </style>