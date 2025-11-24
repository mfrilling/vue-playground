<script setup>

import {ref, defineProps} from "vue";

const props = defineProps({
  type: {type: String, default: 'danger'},
  headline: {type: String, default: ''}
})
</script>

<template>
<div class="alert" :class="`alert-${props.type}`" role="alert">
  <h4 v-if="props.headline" class="alert-heading fs-6">{{$t(props.headline)}}</h4>
  <slot></slot>
</div>
</template>

<style scoped>

</style>