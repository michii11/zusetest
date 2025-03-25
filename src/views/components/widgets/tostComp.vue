<template>
    <ion-row>
        <ion-col>
            <ion-card>
                <ion-card-header>
                    <ion-card-title>Öffnungszeiten Dönnerladen</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle>Montag</ion-card-subtitle>
                                <ion-card-subtitle>12:00 - 20:00</ion-card-subtitle>
                            </ion-col>
                            <ion-col>
                                <ion-card-subtitle>Dienstag</ion-card-subtitle>
                                <ion-card-subtitle>12:00 - 20:00</ion-card-subtitle>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle>Mittwoch</ion-card-subtitle>
                                <ion-card-subtitle>12:00 - 20:00</ion-card-subtitle>
                            </ion-col>
                            <ion-col>
                                <ion-card-subtitle>Donnerstag</ion-card-subtitle>
                                <ion-card-subtitle>12:00 - 20:00</ion-card-subtitle>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle>Freitag</ion-card-subtitle>
                                <ion-card-subtitle>12:00 - 20:00</ion-card-subtitle>
                            </ion-col>
                            <ion-col>
                                <ion-card-subtitle>Samstag</ion-card-subtitle>
                                <ion-card-subtitle>12:00 - 20:00</ion-card-subtitle>
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

