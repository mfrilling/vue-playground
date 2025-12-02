<script setup>
import {computed, onMounted, ref} from "vue";
import {useHousingService} from "@/services/housingService";
import {useDateService} from "@/services/dateService.js";
import {useNotifications} from "@/services/notificationService.js";
import HouseSelect from "@/components/HouseSelect.vue";
import BaseInput from "@/components/utils/BaseInput.vue";
import Card from "@/components/ui/Card.vue";
import BaseCollapse from "@/components/utils/BaseCollapse.vue";
import Alert from "@/components/utils/Alert.vue";
import BaseCheckbox from "@/components/utils/BaseCheckbox.vue";
import ToggleButtonGroup from "@/components/utils/ToggleButtonGroup.vue";
import router from "@/router/index.js";
import RaceSelect from "@/components/events/RaceSelect.vue";
import HatcherySelect from "@/components/events/HatcherySelect.vue";
import EmergingChicksSelect from "@/components/events/EmergingChicksSelect.vue";

const {today, subtractDays} = useDateService();
const {notifySuccess} = useNotifications();

const props = defineProps({
  /*id: { // wenn
    type: String,
    required: false,
  },*/
  house: {
    type: String,
    required: false,
    default: '',
  },
  date: {
    type: String,
    required: false,
    default: '',
  }
})

const {getHousingDetailsData, putHousingDetailsData} = useHousingService()
const {notifyError} = useNotifications()

const isEditMode = computed(() => !!props.house && !!props.date)

const form = ref(createEmptyForm()) // deine eigene Funktion / Struktur
const isAnimalCollapseOpen = ref(false)
const isQsCollapseOpen = ref(false)
const isCleaningCollapseOpen = ref(false)

function createEmptyForm() {
  const threeDaysAgo = subtractDays(new Date(Date.now()), 3)
  const thisDay = today()
  const selectedHouse = ref(props.house || '')

  return {
    hatchery: "",
    date: thisDay,
    disinfectantSurfacesDate: threeDaysAgo,
    disinfectantSurfaces: "",
    disinfectantWateringPlaceDate: threeDaysAgo,
    disinfectantWateringPlace: "",
    bedding: "",
    food: "",
    origin: "",
    originDetails: "",
    id: "",
    itw: false,
    import: 0,
    dayOfLife: "",
    weekOfLife: "",
    deliveryNote: "",
    qs: false,
    race: "",
    regionalWindow: false,
    rodendPests: threeDaysAgo,
    rodendPestsContinuity: false,
    emergingChicks: "",
    housing: selectedHouse.value,
    animalWeight: "",
    animalWelfareLabel: "",
    animalLosses: "",
    animalCount: "",
    vlog: false,
    water: "",
    wateringPlace: "",
    flockNumber: "",
  };
}

async function loadHousing() {
  if (!isEditMode.value) {
    // kein Edit → leeres Formular
    form.value = createEmptyForm();
    isAnimalCollapseOpen.value = true;
    isQsCollapseOpen.value = true;
    isCleaningCollapseOpen.value = true;
    return;
  }

  try {
    const result = await getHousingDetailsData(props.house, props.date);
    if (result.success) {
      // API-Response passend ins Form mappen
      Object.keys(result.data).forEach((key) => {
        form.value[mapApiToForm(key)] = result.data[key];
      })
    } else {
      notifyError(result.message || "Fehler beim Laden der Einstallung.");
    }
  } catch (e) {
    console.error(e);
    notifyError("Fehler beim Laden der Einstallung.");
  }
}

const apiV1Map = {
  id: "ID",
  housing: "Stall",
  date: "Datum",
  animalCount: "Tierzahl",
  hatchery: "Brueterei",
  race: "Rasse",
  emergingChicks: "Schlupfbrut",
  flockNumber: "Herde",
  weekOfLife: "Lebenswoche",
  deliveryNotes: "Lieferschein",
  dayOfLife: "Lebenstag",
  animalWeight: "Tiergewicht",
  animalLosses: "Tierverluste",
  origin: "Herkunft",
  originDetails: "HerkunftDetail",
  qs: "QS",
  itw: "ITW",
  vlog: "VLOG",
  animalWelfareLabel: "Tierschutzlabel1",
  regionalWindow: "Regionalfenster",
  bedding: "Einstreu",
  wateringPlace: "Wasserversorgung",
  rodendPests: "Schadnager",
  disinfectantSurfacesDate: "DesinfektionFlaecheDatum",
  disinfectantWateringPlaceDate: "DesinfektionTraenkeDatum",
  rodendPestsContinuity: "SchadnagerKontinuierlich",
  disinfectantSurfaces: "DesinfektionFlaecheMittel",
  disinfectantWateringPlace: "DesinfektionTraenkeMittel",
  import: "Import",
}

const apiV1ReverseMap = Object.fromEntries(
    Object.entries(apiV1Map).map(([front, back]) => [back, front])
)

function mapFormToApi(key) {
  return apiV1Map[key] || key;
}

function mapApiToForm(key) {
  return apiV1ReverseMap[key] || key;
}

function oncancel() {
  router.push({name: "housings"});
}

async function submit() {
  console.log('### submit', form.value)
  let payload = {};
  Object.keys(form.value).forEach(key => {
    if (form.value[key] !== '') {
      payload[mapFormToApi(key)] = form.value[key];
    }
  })
  console.log('### payload', payload)
  const result = await putHousingDetailsData(form.value.housing, form.value.date, payload)

  if (result.success) {
    notifySuccess('events.housings.details.success', 10000)
    router.push({name: "housings"});
  }
}

onMounted(() => {
  loadHousing();
});
</script>

<template>
  <h1 class="title">
    <button
      class="btn btn-outline-primary"
      @click="oncancel"
    >
      <i class="bi bi-arrow-left-square" /> (cancel)
    </button>
    {{ $t('events.housings.details.title') }}
  </h1>
  <form @submit.prevent="submit">
    <Card class="mb-3">
      <house-select v-model="form.housing" />
      <base-input
        v-model="form.date"
        label="events.housings.date"
        type="date"
      />
    </Card>

    <BaseCollapse
      v-model="isAnimalCollapseOpen"
      title="events.housings.details.animals"
    >
      <HatcherySelect
        v-model="form.hatchery"
        label="events.housings.details.hatchery"
      />
      <RaceSelect
        v-model="form.race"
        label="events.housings.details.race"
      />
      <EmergingChicksSelect
        v-model="form.emergingChicks"
        label="events.housings.details.emerging_chicks"
      />
      <BaseInput
        v-model="form.animalCount"
        label="events.housings.details.animal_count"
      />

      <Alert type="info">
        {{ $t('events.housings.details.multiple_flocks_info') }}
      </Alert>

      <BaseInput
        v-model="form.flockNumber"
        label="events.housings.details.flock_number"
      />

      <div class="row">
        <BaseInput
          v-model="form.weekOfLife"
          label="events.housings.details.week_of_life"
          class="col-6"
        />

        <BaseInput
          v-model="form.dayOfLife"
          label="events.housings.details.day_of_life"
          class="col-6"
          :disabled="true"
        />
      </div>

      <BaseInput
        v-model="form.deliveryNote"
        label="events.housings.details.delivery_note"
      />
    </BaseCollapse>

    <BaseCollapse
      v-model="isQsCollapseOpen"
      title="events.housings.details.qs"
    >
      Herkunft-Button-Auswahl
      <ToggleButtonGroup
        v-model="form.origin"
        label="events.housings.details.origin"
        :options="[{value: 'bornAndRaised', label: 'events.housings.details.born_and_raised'}, {value: 'raised', label: 'events.housings.details.raised'}, {value: 'raisedIn', label: 'events.housings.details.raised_in'}]"
        :classes="form.origin === 'raisedIn' ? 'mb-1' : 'mb-3'"
      />
      <BaseInput
        v-show="form.origin === 'raisedIn'"
        v-model="form.originDetails"
        placeholder="events.housings.details.origin_details_placeholder"
      />

      <label class="form-label">
        {{ $t('events.housings.details.labels_and_programs') }}
      </label>
      <BaseCheckbox
        v-model="form.qs"
        label="events.housings.details.qs_label"
        container-classes="mb-1"
      />
      <BaseCheckbox
        v-model="form.itw"
        label="events.housings.details.itw_label"
        container-classes="mb-1"
      />
      <BaseCheckbox
        v-model="form.vlog"
        label="events.housings.details.vlog_label"
        container-classes="mb-1"
      />
      <BaseCheckbox
        v-model="form.animalWelfareLabel"
        label="events.housings.details.animal_welfare_label"
        container-classes="mb-4"
      />

      <BaseInput
        v-model="form.bedding"
        label="events.housings.details.bedding"
      />

      <ToggleButtonGroup
        v-model="form.wateringPlace"
        :options="[{value: 'Öffentlich', label: 'events.housings.details.watering_place_public'}, {value: 'Privat', label: 'events.housings.details.watering_place_private'}]"
        label="events.housings.details.watering_place"
      />

      <BaseInput
        v-model="form.rodendPests"
        label="events.housings.details.rodend_pests"
        type="date"
        form-group-classes="mb-0"
      />
      <BaseCheckbox
        v-model="form.rodendPestsContinuity"
        label="events.housings.details.rodend_pests_continuity"
      />
    </BaseCollapse>

    <BaseCollapse
      v-model="isCleaningCollapseOpen"
      title="events.housings.details.cleaning"
    >
      <BaseInput
        v-model="form.disinfectantSurfaces"
        label="events.housings.details.disinfectant_surfaces"
        form-group-classes="mb-1"
      />
      <BaseInput
        v-model="form.disinfectantSurfacesDate"
        type="date"
      />

      <BaseInput
        v-model="form.disinfectantWateringPlace"
        label="events.housings.details.disinfectant_watering_place"
        form-group-classes="mb-1"
      />
      <BaseInput
        v-model="form.disinfectantWateringPlaceDate"
        type="date"
      />
    </BaseCollapse>

    <button
      class="btn btn-primary w-100 mb-3"
      type="submit"
    >
      {{ $t('events.housings.details.submit') }}
    </button>
  </form>

  <!-- dein Formular mit v-model="form.Feld" -->
</template>
