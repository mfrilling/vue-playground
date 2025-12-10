<script setup>

import Card from "@/components/ui/Card.vue";
import { useDateService } from "@/services/dateService.js";

const { delivery } = defineProps(
  {
    delivery: {
      type: Object,
      required: true,
    },
  }
)

const emit = defineEmits(["edit", "delete"])

const { formatReadable } = useDateService()

function onDeletionClick() {
  emit("delete", delivery)
}

function onEditClick() {
  emit("edit", delivery)
}
</script>

<template>
  <Card>
    <div class="row align-items-center">
      <div class="col-6 col-md-4 col-lg-2 fw-bold center-vertical">
        {{ formatReadable(delivery.Datum) }}
        <span
          class="fw-normal"
          :data-tooltip="$t('general.import.info')"
        >
          <span
            v-if="delivery.Import"
            class="badge bg-primary mx-1"
          >
            {{ $t('general.import.label') }}
          </span>
        </span>
      </div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical my-lg-3">
        {{ delivery.Silo }}
      </div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical">
        {{ delivery.Produkt }}
      </div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical">
        {{ delivery.Menge }} {{ $t("general.kilograms_short") }}
      </div>
      <div class="col-12 col-md-12 col-lg-4 d-flex justify-content-end">
        <button
          v-if="!delivery.Import"
          class="btn btn-primary my-1 mx-1"
          type="button"
          @click="onEditClick"
        >
          {{ $t('general.edit') }}
        </button>
        <button
          v-if="!delivery.Import"
          class="btn btn-outline-danger my-1 ms-1"
          type="button"
          @click="onDeletionClick"
        >
          {{ $t('general.delete') }}
        </button>
        <button
          v-if="delivery.Import"
          class="btn btn-primary my-1 mx-1"
          type="button"
          @click="onEditClick"
        >
          👁️ {{ $t('general.show') }}
        </button>
      </div>
    </div>
  </Card>
</template>