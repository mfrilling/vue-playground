<script setup>

import BaseInput from "@/components/utils/BaseInput.vue";

const props = defineProps({
  form: Object
})
</script>

<template>


  <label class="form-label pb-0 ps-0 mb-0 col-12 text-end">
    <span class="text-muted text-end">{{ $t('general.today') }}</span>
  </label>
  <div class="row">
    <div class="col-3">
      <label for="amount" class="form-label">{{ $t('journal.form.losses') }}</label>
    </div>
    <div class="col-3">
      <label for="amount" class="form-label">{{ $t('journal.form.losses_small') }}</label>
    </div>
    <div class="col-3">
      <label for="amount" class="form-label">{{ $t('journal.form.losses_selected') }}</label>
    </div>
    <div class="col-3">
      <label for="amount" class="form-label">{{ $t('journal.form.losses_dead') }}</label>
    </div>
  </div>
  <div class="row">
    <div class="col-3">
      <label for="amount" class="form-label">{{ $t('journal.form.losses_morning') }}</label>
    </div>
    <div class="col-3">
      <BaseInput v-model="form.VerlusteMorgensKleine"></BaseInput>
    </div>
    <div class="col-3">
      <BaseInput v-model="form.VerlusteMorgensSelektierte"></BaseInput>
    </div>
    <div class="col-3">
      <BaseInput v-model="form.VerlusteMorgensTote"></BaseInput>
    </div>
    <div class="col-3">
      <label for="amount" class="form-label">{{ $t('journal.form.losses_evening') }}</label>
    </div>
    <div class="col-3">
      <BaseInput v-model="form.VerlusteAbendsKleine"></BaseInput>
    </div>
    <div class="col-3">
      <BaseInput v-model="form.VerlusteAbendsSelektierte"></BaseInput>
    </div>
    <div class="col-3">
      <BaseInput v-model="form.VerlusteAbendsTote"></BaseInput>
    </div>
  </div>
</template>
