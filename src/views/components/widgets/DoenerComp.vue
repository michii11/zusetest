<template>
    <ion-row>
        <ion-col>
            <ion-card>
                <ion-card-header>
                    <ion-card-title>{{ $t("widgets_döner_title") }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle> {{ $t("weekdays_1") }}</ion-card-subtitle>
                                <ion-card-subtitle> {{ $t("widgets_döner_closed") }}</ion-card-subtitle>
                            </ion-col>
                            <ion-col>
                                <ion-card-subtitle> {{ $t("weekdays_2") }}</ion-card-subtitle>
                                <ion-card-subtitle>10:00 - 22:00</ion-card-subtitle>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle>{{ $t("weekdays_3") }}</ion-card-subtitle>
                                <ion-card-subtitle>10:00 - 22:00</ion-card-subtitle>
                            </ion-col>
                            <ion-col>
                                <ion-card-subtitle>{{ $t("weekdays_4") }}</ion-card-subtitle>
                                <ion-card-subtitle>10:00 - 22:00</ion-card-subtitle>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle>{{ $t("weekdays_5") }}</ion-card-subtitle>
                                <ion-card-subtitle>10:00 - 22:00</ion-card-subtitle>
                            </ion-col>
                            <ion-col>
                                <ion-card-subtitle>{{ $t("weekdays_6") }}</ion-card-subtitle>
                                <ion-card-subtitle>10:00 - 22:00</ion-card-subtitle>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle>{{ $t("weekdays_7") }}</ion-card-subtitle>
                                <ion-card-subtitle>12:00 - 21:00</ion-card-subtitle>
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
