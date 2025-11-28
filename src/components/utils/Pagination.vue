<script setup>
import {computed} from "vue";
import BaseSelect from "@/components/utils/BaseSelect.vue";

const emit = defineEmits(['update:currentPage']);

const props = defineProps({
  currentPage: {
    type: Number,
    default: 0
  },
  lastPage: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 15
  }
});


const currentPage1 = computed(() => props.currentPage + 1); // 1-basiert
const totalPages = computed(() => props.lastPage);

/*const startEntry = computed(() => {
  if (props.totalItems === 0) return 0;
  return props.currentPage * props.itemsPerPage + 1;
});

const endEntry = computed(() => {
  if (props.totalItems === 0) return 0;
  return Math.min(
      props.totalItems,
      (props.currentPage + 1) * props.itemsPerPage
  );
});*/

const pageItems = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const cur = currentPage1.value;

  if (!total || total <= 0) return pages;

  // Wenige Seiten: alle anzeigen
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Am Anfang (Seite 1 bis 4)
  if (cur <= 4) {
    for (let i = 1; i <= 5; i++) {
      pages.push(i);
    }
    pages.push("dots-right");
    pages.push(total);
    return pages;
  }

  // Am Ende (letzten 4 Seiten)
  if (cur >= total - 3) {
    pages.push(1);
    pages.push("dots-left");
    for (let i = total - 4; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  // In der Mitte
  pages.push(1);
  pages.push("dots-left");
  for (let i = cur - 2; i <= cur + 2; i++) {
    pages.push(i);
  }
  pages.push("dots-right");
  pages.push(total);
  return pages;
});


function goTo(page) {
  if (page === "previous") {
    const newPage = Math.max(props.currentPage - 1, 0);
    emit("update:currentPage", newPage);
    return;
  }

  if (page === "next") {
    const newPage = Math.min(props.currentPage + 1, props.lastPage - 1);
    emit("update:currentPage", newPage);
    return;
  }

  if (typeof page === "number") {
    const index = page - 1; // 1-basiert -> 0-basiert
    emit("update:currentPage", index);
    return;
  }

  console.error("Ungültiger page-Wert:", page);
}
</script>

<template>
  <nav v-if="totalPages > 1"
       aria-label="Page navigation">
    <ul class="pagination justify-content-center">

      <!-- Previous -->
      <li class="page-item" :class="{ disabled: currentPage1 === 1 }">
        <button
            class="page-link"
            type="button"
            @click="goTo('previous')"
            :disabled="currentPage1 === 1"
            aria-label="Previous"
        >
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>

      <!-- Page Buttons + Dots -->
      <li
          v-for="item in pageItems"
          :key="item + ''"
          class="page-item"
          :class="{
          active: typeof item === 'number' && item === currentPage1,
          disabled: typeof item !== 'number',
        }"
      >
        <span
            v-if="typeof item !== 'number'"
            class="page-link"
        >
          …
        </span>
        <button
            v-else
            class="page-link"
            type="button"
            @click="goTo(item)"
        >
          {{ item }}
        </button>
      </li>

      <!-- Next -->
      <li class="page-item" :class="{ disabled: currentPage1 === totalPages }">
        <button
            class="page-link"
            type="button"
            @click="goTo('next')"
            :disabled="currentPage1 === totalPages"
            aria-label="Next"
        >
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>

    </ul>
  </nav>
<!--
  <BaseSelect :options="[15,25,50,100]" ></BaseSelect>-->
</template>