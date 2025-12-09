<script setup>
const props = defineProps({
  id: {
    type: String,
    default: 'fileSchlachtberichtLSLC'
  },
  accept: {
    type: String,
    default: 'application/pdf,.pdf'
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['file-selected', 'files-selected'])

const onChange = (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return

  if (props.multiple) {
    // Alle Dateien an Parent
    emit('files-selected', files)
  } else {
    // Nur eine Datei an Parent
    emit('file-selected', files[0])
  }

  // Zurücksetzen, damit dieselbe Datei erneut gewählt werden kann
  event.target.value = ''
}
</script>

<template>
  <form class="d-inline ms-2">
    <label
      :for="id"
      class="btn btn-outline-primary"
    ><slot/></label>
    <input
      :id="id"
      type="file"
      :accept="accept"
      :multiple="multiple"
      class="d-none"
      @change="onChange"
    >
  </form>
</template>
