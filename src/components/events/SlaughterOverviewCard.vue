<script setup>

import Card from "@/components/ui/Card.vue";
import { useDateService } from "@/services/dateService.js";

const { slaughter } = defineProps(
    {
      slaughter: {
        type: Object,
        required: true,
      },
    }
)

const emit = defineEmits(["edit", "delete"])

const { formatReadable } = useDateService()

function onDeletionClick() {
  emit("delete", slaughter)
}

function onEditClick() {
  emit("edit", slaughter)
}
</script>

<template>
  <Card>
    <div class="row align-items-center">
      <div class="col-6 col-md-4 col-lg-2 fw-bold center-vertical">
        {{ formatReadable(slaughter.Datum) }}
      </div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical my-lg-3">
        {{ slaughter.Stall }}
      </div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical">
        {{ slaughter.Schlachthof }}
      </div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical">
        {{ slaughter.Umfang }}
      </div>
      <div class="col-12 col-md-12 col-lg-4 d-flex justify-content-end">
        <button
          class="btn btn-primary my-1 mx-1"
          type="button"
          @click="onEditClick"
        >
          {{ $t('general.edit') }}
        </button>
        <button
          class="btn btn-outline-danger my-1 ms-1"
          type="button"
          @click="onDeletionClick"
        >
          {{ $t('general.delete') }}
        </button>
      </div>
    </div>
  </Card>
</template>