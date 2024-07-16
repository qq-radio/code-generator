<template>
  <div>
    <a-select v-model:value="value" :options="typeOptions" style="width: 100%" allowClear />
  </div>
</template>

<script setup lang="ts">
const value = defineModel()

const typeOptions = [
  {
    label: 'base-select',
    value: 'base-select'
  },
  {
    label: 'change-type-select',
    value: 'change-type-select'
  },
  {
    label: 'forklift-driver-type-select',
    value: 'forklift-driver-type-select'
  },
  {
    label: 'gyl-dept-tree-select',
    value: 'gyl-dept-tree-select'
  },
  {
    label: 'prod-line-select',
    value: 'prod-line-select'
  },
  {
    label: 'shift-select',
    value: 'shift-select'
  },
  {
    label: 'storage-type-select',
    value: 'storage-type-select'
  }
]
</script>
