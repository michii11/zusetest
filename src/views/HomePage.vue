<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>ZusetestApp</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-grid :fixed="true">
        <ion-row>
          <ion-button id="present-alert">Click Me</ion-button>
      <ion-button id="wrapped" router-link="/new-page">Nächste Seite</ion-button>
        </ion-row>
      </ion-grid>
  <ion-alert
    trigger="present-alert"
    header="A Short Title Is Best"
    sub-header="A Sub Header Is Optional"
    message="A message should be a short, complete sentence."
    :buttons="alertButtons"
  ></ion-alert>

      <div id="container">
        <strong>Ready to create an app?</strong>
        <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      </div> 
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/vue';
import { IonAlert, IonButton } from '@ionic/vue';

  const alertButtons = ['Action'];

</script>

<style scope>
#wrapped {
  flex-wrap: wrap;
}

#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}</style>