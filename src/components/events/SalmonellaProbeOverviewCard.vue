<script setup>

import Card from "@/components/ui/Card.vue";
import {useDateService} from "@/services/dateService.js";

const {salmonellaProbe} = defineProps(
    {
      salmonellaProbe: {
        type: Object,
        required: true,
      },
    }
)

const emit = defineEmits(["duplicate", "edit", "delete"])

const {formatReadable} = useDateService()

function onDuplicateClick() {
  emit("duplicate", salmonellaProbe)
}
function onDeletionClick() {
  emit("delete", salmonellaProbe)
}

function onEditClick() {
  emit("edit", salmonellaProbe)
}
</script>

<template>
  <Card>
    <div class="row">
      <div class="col-6 col-lg-4 fw-bold center-vertical">
        {{ $t('events.salmonellaProbes.probe')}}: {{ formatReadable(salmonellaProbe.SockenprobeDatum) }}
      </div>
      <div class="col-6 col-lg-4 center-vertical my-lg-3">
        {{ salmonellaProbe.Stall }}
      </div>
      <div class="col-12 col-md-12 col-lg-4 text-end">
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

<style scoped>

</style>