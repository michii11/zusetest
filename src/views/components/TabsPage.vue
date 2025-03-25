<template>
    <ion-page>
      <ion-tabs>
        <!-- Der IonRouterOutlet zeigt den Inhalt der Route basierend auf der aktiven Tab-Seite -->
        <ion-router-outlet></ion-router-outlet>
  
        <!-- Die Tab-Leiste unten -->
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="home" href="/tabs/home">
            <ion-icon :icon="homeOutline" />
            <ion-label>Home</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="SchoolMap" href="/tabs/school-map">
            <ion-icon :icon="mapOutline" />
            <ion-label>Karte</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="Hub" href="/tabs/hub">
            <ion-icon :icon="peopleOutline" />
            <ion-label>Hub</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="Settings" href="/tabs/settings">
            <ion-icon :icon="settingsOutline" />
            <ion-label>Einstellungen</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
  </template>
  
  <script setup>
    import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
    import { settingsOutline, mapOutline, peopleOutline, homeOutline } from 'ionicons/icons';
  </script>
  
  <style scoped>
  ion-tab-button.tab-selected {
  color: #64A70B !important; /* Aktiver Tab */
  font-weight: bold;
}
</style>