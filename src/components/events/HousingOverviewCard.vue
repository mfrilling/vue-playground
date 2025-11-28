<script setup>

import Card from "@/components/ui/Card.vue";

const {housing} = defineProps(
    {
      housing: {
        type: Object,
        required: true,
      }
    }
)
</script>

<template>
  <Card>
    <div class="row">
      <div class="col-6 col-md-4 col-lg-2 fw-bold center-vertical">{{ housing.Datum }}</div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical my-lg-3">{{ housing.Stall }}</div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical">Herde: {{ housing.Herde ?? '-' }}</div>
      <div class="col-6 col-md-4 col-lg-2 center-vertical">LW {{ housing.Lebenswoche ?? '-' }}</div>
      <div class="col-12 col-md-12 col-lg-4 text-end">
        <button class="btn btn-primary my-1 mx-1 " type="button">{{ $t('general.duplicate') }}</button>
        <button class="btn btn-primary my-1 mx-1" type="button">{{ $t('general.edit') }}</button>
        <button class="btn btn-outline-danger my-1 ms-1" type="button">{{ $t('general.delete') }}</button>
      </div>
    </div>
  </Card>
</template>

<style scoped>

</style>