<template>
  <ion-row>
    <ion-col>
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ $t('messages_title') }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          {{ $t('messages_empty') }}
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>
</template>


<script setup>
import { IonRow, IonCol, IonCardContent, IonCard, IonCardHeader, IonCardTitle} from '@ionic/vue';
</script>
