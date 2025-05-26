<template>
    <ion-row>
        <ion-col>
            <ion-card>
                <ion-card-header>
                    <ion-card-title>{{ $t("widgets_contacts_title") }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-grid>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle>{{ $t("weekdays_1") }} - {{ $t("weekdays_4") }}</ion-card-subtitle>
                                <ion-card-subtitle>7:30 - 12:00</ion-card-subtitle>
                                <ion-card-subtitle>13:00 - 15:00</ion-card-subtitle>
                            </ion-col>
                            <ion-col>
                                <ion-card-subtitle>Jahnstr. 5</ion-card-subtitle>
                                <ion-card-subtitle>36088 Hünfeld</ion-card-subtitle>
                                <ion-card-subtitle>+49 661 6006554000</ion-card-subtitle>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                            <ion-col>
                                <ion-card-subtitle>{{ $t("weekdays_5") }}</ion-card-subtitle>
                                <ion-card-subtitle>7:30 - 15:00</ion-card-subtitle>
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