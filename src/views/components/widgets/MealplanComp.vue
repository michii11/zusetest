<template>
  <ion-row>
    <ion-col>
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ $t("widgets_mealplan_title") }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col>
                <ion-card-subtitle>{{ $t("mealplan_fries") }}</ion-card-subtitle>
                <ion-card-subtitle>{{ $t("mealplan_fries_price") }}</ion-card-subtitle>
              </ion-col>
              <ion-col>
                <ion-card-subtitle>{{ $t("mealplan_soup") }}</ion-card-subtitle>
                <ion-card-subtitle>{{ $t("mealplan_soup_price") }}</ion-card-subtitle>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                <ion-card-subtitle>{{ $t("mealplan_pasta") }}</ion-card-subtitle>
                <ion-card-subtitle>{{ $t("mealplan_pasta_price") }}</ion-card-subtitle>
              </ion-col>
              <ion-col>
                <ion-card-subtitle>{{ $t("mealplan_salad") }}</ion-card-subtitle>
                <ion-card-subtitle>{{ $t("mealplan_salad_price") }}</ion-card-subtitle>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                <ion-card-subtitle>{{ $t("mealplan_dinner") }}</ion-card-subtitle>
                <ion-card-subtitle>{{ $t("mealplan_dinner_time") }}</ion-card-subtitle>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col>
                <ion-card-subtitle>{{ $t("mealplan_pizza") }}</ion-card-subtitle>
                <ion-card-subtitle>{{ $t("mealplan_pizza_price") }}</ion-card-subtitle>
              </ion-col>
              <ion-col>
                <ion-card-subtitle>{{ $t("mealplan_lasagna") }}</ion-card-subtitle>
                <ion-card-subtitle>{{ $t("mealplan_lasagna_price") }}</ion-card-subtitle>
                <ion-card-subtitle>{{ $t("mealplan_more") }}</ion-card-subtitle>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script setup>
import {
  IonRow,
  IonCol,
  IonCardContent,
  IonCardSubtitle,
  IonGrid,
  IonCard,
  IonCardHeader,
  IonCardTitle
} from '@ionic/vue';
</script>
