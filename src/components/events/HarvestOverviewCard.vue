<script setup>

import Card from "@/components/ui/Card.vue";
import { useDateService } from "@/services/dateService.js";

const { harvest } = defineProps(
    {
      harvest: {
        type: Object,
        required: true,
      },
    }
)

const emit = defineEmits(["duplicate", "edit", "delete"])

const { formatReadable } = useDateService()

function onDuplicateClick() {
  emit("duplicate", harvest)
}
function onDeletionClick() {
  emit("delete", harvest)
}

function onEditClick() {
  emit("edit", harvest)
}
</script>

<template>
  <Card>
    <div class="row align-items-center">
      <div class="col-6 col-md-4 col-lg-2 fw-bold center-vertical">
        {{ formatReadable(harvest.Datum) }}
      </div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical my-lg-3">
        {{ harvest.Stall }}
      </div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical">
        {{ harvest.Schlachthof }}
      </div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical" />
      <div class="col-12 col-md-12 col-lg-4 d-flex justify-content-end">
        <button
          class="btn btn-primary my-1 mx-1 "
          type="button"
          @click="onDuplicateClick"
        >
          {{ $t('general.duplicate') }}
        </button>
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