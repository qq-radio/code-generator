<template>
  <v-select v-model="selectedValue" :options="options" :clearable="false" :appendToBody="true" />
</template>

<script setup lang="ts">
const selectedValue = ref()

const emits = defineEmits(['update:modelValue'])

watch(
  () => selectedValue.value,
  () => {
    emits('update:modelValue', selectedValue.value.value)
  }
)

defineProps({
  options: { type: Array, required: true },
  modelValue: {}
})
</script>

<style lang="less" scoped>
@import 'vue-select/dist/vue-select.css';

/deep/ .vs__selected-options {
  overflow: hidden;
}

/deep/ .vs__selected {
  width: 88%;
  height: 20px;
  padding-right: 0px;
  margin-right: 0px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/deep/ .vs__actions {
  position: absolute;
  top: 8px;
  right: 0;
}
</style>
