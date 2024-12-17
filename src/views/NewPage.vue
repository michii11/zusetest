<template>
    <ion-menu content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu Content</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">This is the menu content.</ion-content>
  </ion-menu>
  <ion-page id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding"> Tap the button in the toolbar to open the menu. </ion-content>
    <ion-button router-link="/home">press me</ion-button>
  </ion-page>
  </template>
  
  <script setup>
    import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonMenu } from '@ionic/vue';
    import { IonButton } from '@ionic/vue';
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
    margin-top: 20px;
  }
  </style>
  