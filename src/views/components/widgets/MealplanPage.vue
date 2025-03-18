<template>
    <ion-row>
        <ion-col>
            <ion-card>
                <ion-card-header>
                    <ion-card-title>{{ l.widgets_mealplan_title }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle>Pommes frites Tüte</ion-card-subtitle>
                                <ion-card-subtitle>1,70€</ion-card-subtitle>
                            </ion-col>
                            <ion-col>
                                <ion-card-subtitle>Champignon-cremesuppe</ion-card-subtitle>
                                <ion-card-subtitle>0,36€ je 100g</ion-card-subtitle>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle>Weizen Nudeln</ion-card-subtitle>
                                <ion-card-subtitle>2,60€</ion-card-subtitle>
                            </ion-col>
                            <ion-col>
                                <ion-card-subtitle>Gemischter Blattsalat</ion-card-subtitle>
                                <ion-card-subtitle>0,80€</ion-card-subtitle>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle>Abendmensa</ion-card-subtitle>
                                <ion-card-subtitle>17:00 - 21:00</ion-card-subtitle>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle>Pizza verschiedener Art</ion-card-subtitle>
                                <ion-card-subtitle>3,60€ - 5,90€</ion-card-subtitle>
                            </ion-col>
                            <ion-col>
                                <ion-card-subtitle>Lasagne Bolognese</ion-card-subtitle>
                                <ion-card-subtitle>3,60€</ion-card-subtitle>
                                <ion-card-subtitle>...</ion-card-subtitle>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-card-content>
            </ion-card>
        </ion-col>
    </ion-row>
</template>

<script setup>
import { IonRow, IonCol, IonCardContent, IonCardSubtitle, IonGrid, IonCard, IonCardHeader, IonCardTitle} from '@ionic/vue';
</script>