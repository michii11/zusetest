<template>
    <ion-row>
        <ion-col>
            <ion-card>
                <ion-card-header>
                    <ion-card-title>{{ $t("widgets_pt_title") }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    {{ $t("widgets_pt_text") }}
                </ion-card-content>
            </ion-card>
        </ion-col>
    </ion-row>
  </template>

<script setup>
import { IonRow, IonCol, IonCardContent, IonCard, IonCardHeader, IonCardTitle} from '@ionic/vue';
</script>