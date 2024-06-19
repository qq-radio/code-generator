<template>Please select project token: <a-radio-group v-model:value="value" :options="options" /></template>

<script lang="ts" setup>
import { mapObjectArrayFields } from '@/utils'

const modules: Record<string, Config> = import.meta.glob('/interface-token.json', {
  eager: true,
  import: 'default'
})
console.log('modules:', Object.values(modules))

const options = mapObjectArrayFields(Object.values(modules)[0], {
  label: 'name',
  value: 'token'
})
console.log('options:', options)

const value = defineModel()
</script>
