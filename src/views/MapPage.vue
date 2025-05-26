<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
                          <div slot="secondary" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
                    <img src="/images/KZS-LOGO_Graue_Schrift.svg" alt="Konrad-Zuse-Schule" style="padding: 5px; width: 128px;">
                  </div> 
      </ion-toolbar>
    </ion-header>
 
    <ion-content>
      <!-- Suchleiste + Route-Buttons -->
      <div class="search-wrapper">
        <ion-searchbar
          v-model="raumEingabe"
          placeholder="Raum suchen"
          @ionInput="onSearchInput"
          @ionFocus="zeigeAuswahl = true"
        />
        <ion-button
          @click="starteRoutenModus"
          class="route-button"
          size="small"
          fill="outline"
        >
          Route
        </ion-button>
        <ion-button
          v-if="routeExists"
          @click="loescheRoute"
          class="delete-button"
          size="small"
          fill="clear"
        >
          {{$t('map_delete_route')}}
        </ion-button>
      </div>
 
      <!-- Gebäude-Auswahl + Vorschläge -->
      <ion-item v-if="zeigeAuswahl">
        <ion-label>{{$t('map_building')}}</ion-label>
        <ion-select
          v-model="gebaeude"
          placeholder="Gebäude wählen"
          @ionChange="onSearchInput"
        >
          <ion-select-option
            v-for="g in alleGebaeude"
            :key="g"
            :value="g"
          >{{ g }}</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-list v-if="zeigeAuswahl && vorschlaege.length">
        <ion-item
          v-for="v in sichtbareVorschlaege"
          :key="v"
          button
          @click="raumSuchen(v)"
        >{{ gebaeude }}_{{ v }}</ion-item>
        <ion-item
          v-if="vorschlaege.length > maxVorschlaege && !alleAnzeigen"
          button
          @click="alleAnzeigen = true"
        >
          {{$t('map_show_more')}} ({{ vorschlaege.length - maxVorschlaege }})
        </ion-item>
        <ion-item button color="medium" @click="zeigeAuswahl = false">
          {{$t('map_close_search')}}
        </ion-item>
      </ion-list>
 
      <!-- Ausgewählter Raum -->
      <ion-item v-if="selectedRoom">
        <ion-label>{{$t('map_show_more')}}: {{ selectedRoom }}</ion-label>
      </ion-item>
 
      <!-- Start-Banner -->
      <ion-card v-if="routenModusSelectingStart" class="start-banner">
        <ion-card-content>
          {{$t('map_now_click')}}
          <ion-button slot="end" fill="clear" size="small"
            @click="routenModusSelectingStart = false">✖
          </ion-button>
        </ion-card-content>
      </ion-card>
 
      <!-- SVG-Container -->
      <div id="svg-container" v-html="svgContent" class="svg-wrapper" />
 
      <!-- Zielauswahl -->
      <ion-modal :is-open="showDestinationModal" backdrop-dismiss="false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{$t('map_select_destination')}}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="cancelDestination">{{$t('cancel')}}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-item>
            <ion-label>{{$t('map_building')}}</ion-label>
            <ion-select
              v-model="gebDest"
              placeholder="Gebäude wählen"
              @ionChange="onSearchDest"
            >
              <ion-select-option
                v-for="g in alleGebaeude"
                :key="g"
                :value="g"
              >{{ g }}</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-searchbar
            v-if="gebDest"
            v-model="destInput"
            placeholder="Raum suchen"
            @ionInput="onSearchDest"
          />
          <ion-list v-if="gebDest && vorschlaegeDest.length">
            <ion-item
              v-for="v in sichtbareVorschlaegeDest"
              :key="v"
              button
              @click="zielRaumAuswaehlen(v)"
            >{{ gebDest }}_{{ v }}</ion-item>
            <ion-item
              v-if="vorschlaegeDest.length > maxVorschlaege && !alleAnzeigenDest"
              button
              @click="alleAnzeigenDest = true"
            >
              {{$t('map_show_more')}} ({{ vorschlaegeDest.length - maxVorschlaege }})
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>
 
<script>
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonSearchbar, IonItem, IonLabel, IonSelect, IonSelectOption,
  IonList, IonButton, IonModal, IonCard, IonCardContent, IonButtons
} from '@ionic/vue';
 
export default {
  name: 'MapPage',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonItem, IonLabel, IonSelect, IonSelectOption,
    IonList, IonButton, IonModal, IonCard, IonCardContent, IonButtons
  },
  data() {
    return {
      svgContent: '',
      gebaeude: '',
      raumEingabe: '',
      defaultColor: 'lightgray',
      highlightColor: 'orange',
      alleRaeume: [],
      vorschlaege: [],
      zeigeAuswahl: false,
      alleAnzeigen: false,
      maxVorschlaege: 3,
      alleGebaeude: ['A','B','C','D','E','F','G'],
 
      selectedRoom: null,
      routeExists: false,
      routenModusSelectingStart: false,
      showDestinationModal: false,
      routenStart: null,
 
      gebDest: '',
      destInput: '',
      vorschlaegeDest: [],
      alleAnzeigenDest: false
    };
  },
  computed: {
    sichtbareVorschlaege() {
      return this.alleAnzeigen
        ? this.vorschlaege
        : this.vorschlaege.slice(0, this.maxVorschlaege);
    },
    sichtbareVorschlaegeDest() {
      return this.alleAnzeigenDest
        ? this.vorschlaegeDest
        : this.vorschlaegeDest.slice(0, this.maxVorschlaege);
    }
  },
  mounted() {
    fetch('/assets/Bauplan_Schule.IDs.svg')
      .then(r => r.text())
      .then(svg => {
        this.svgContent = svg;
        this.$nextTick(() => {
          this.extractRaumIds();
          this.addRoomClickHandlers();
 
          const svgEl = document.querySelector('#svg-container svg');
          if (svgEl) {
            svgEl.querySelectorAll('[id^="gang_"], [id^="connector_"]').forEach(el => {
              el.style.display = 'none';
            });
          }
        });
      });
  },
  methods: {
    extractRaumIds() {
      this.alleRaeume = [];
      document.querySelectorAll('polygon, rect, path').forEach(el => {
        const id = el.id;
        if (id && /^[A-G]_[\w\d.\-]+$/.test(id)) {
          this.alleRaeume.push(id);
        }
      });
    },
 
    onSearchInput() {
      const e = this.raumEingabe.trim().toLowerCase();
      this.alleAnzeigen = false;
      if (!this.gebaeude) {
        this.vorschlaege = [];
      } else {
        this.vorschlaege = this.alleRaeume
          .filter(id => id.startsWith(this.gebaeude + '_'))
          .map(id => id.split('_').slice(1).join('_'))
          .filter(r => !e || r.toLowerCase().includes(e));
      }
    },
 
    raumSuchen(v) {
      const id = `${this.gebaeude}_${v}`;
      this.resetRoomFills();
      const el = document.getElementById(id);
      if (el) {
        el.style.fill = 'red';
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.selectedRoom = id;
      }
      this.vorschlaege = [];
      this.zeigeAuswahl = false;
    },
 
    starteRoutenModus() {
      this.routenModusSelectingStart = true;
      this.routeExists = false;
      this.selectedRoom = null;
    },
 
    addRoomClickHandlers() {
      this.alleRaeume.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          if (this.routenModusSelectingStart) {
            this.routenStart = id;
            this.routenModusSelectingStart = false;
            this.selectedRoom = null;
            this.openDestinationModal();
          } else {
            this.resetRoomFills();
            el.style.fill = this.highlightColor;
            this.selectedRoom = id;
          }
        });
      });
    },
 
    resetRoomFills() {
      this.alleRaeume.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.fill = this.defaultColor;
      });
    },
 
    openDestinationModal() {
      this.showDestinationModal = true;
      this.gebDest = '';
      this.destInput = '';
      this.vorschlaegeDest = [];
      this.alleAnzeigenDest = false;
    },
 
    cancelDestination() {
      this.showDestinationModal = false;
    },
 
    onSearchDest() {
      const e = this.destInput.trim().toLowerCase();
      this.alleAnzeigenDest = false;
      if (!this.gebDest) {
        this.vorschlaegeDest = [];
      } else {
        this.vorschlaegeDest = this.alleRaeume
          .filter(id => id.startsWith(this.gebDest + '_'))
          .map(id => id.split('_').slice(1).join('_'))
          .filter(r => !e || r.toLowerCase().includes(e));
      }
    },
 
    zielRaumAuswaehlen(v) {
      const toId = `${this.gebDest}_${v}`;
      this.showDestinationModal = false;
      this.drawCorridorRoute(this.routenStart, toId);
    },
 
    drawCorridorRoute(startId, targetId) {
      const svg = document.querySelector('#svg-container svg');
      if (!svg) return;
 
      svg.querySelectorAll('[id^="connector_"], [id^="gang_"]').forEach(el => {
        el.removeAttribute('stroke');
        el.removeAttribute('stroke-width');
        el.style.display = 'none';
      });
 
      const startCon = svg.getElementById(`connector_${startId}`);
      const endCon = svg.getElementById(`connector_${targetId}`);
      [startCon, endCon].forEach(el => {
        if (el) {
          el.style.display = 'block';
          el.removeAttribute('style');
          el.setAttribute('stroke', 'red');
          el.setAttribute('stroke-width', '4');
        }
      });
 
      svg.querySelectorAll('[id^="gang_"]').forEach(gangEl => {
        gangEl.style.display = 'block';
        gangEl.removeAttribute('style');
        gangEl.setAttribute('stroke', 'blue');
        gangEl.setAttribute('fill', 'none');
        gangEl.setAttribute('stroke-width', '1.5');
      });
 
      this.routeExists = true;
    },
 
    loescheRoute() {
      const svg = document.querySelector('#svg-container svg');
      if (!svg) return;
 
      svg.querySelectorAll('[id^="connector_"], [id^="gang_"]').forEach(el => {
        el.removeAttribute('stroke');
        el.removeAttribute('stroke-width');
        el.style.display = 'none';
      });
 
      this.routeExists = false;
    }
  }
};
</script>
 
<style scoped>
.svg-wrapper {
  width: 100%;
  height: auto;
  overflow-x: auto;
  overflow-y: auto;
}
.search-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
}
.route-button { font-size: 0.85rem; height: 32px; }
.delete-button { font-size: 0.75rem; height: 32px; }
.start-banner {
  position: absolute;
  top: 80px; left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 1rem);
  z-index: 10;
}
</style>