<template>
  <div>
    <div v-for="(group, index) in groups" :key="index">
      <div c class="mb-2 border-0 border-b border-solid border-gray-500 pb-2">{{ group.title }}</div>
      <a-radio-group v-model:value="value" :options="group.children" @change="onChange" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { mapObjectArrayFields } from '@/utils'

const modules: Record<string, any> = import.meta.glob('/privacy-token.json', {
  eager: true,
  import: 'default'
})

const groups = Object.values(modules)[0].map((item: any) => ({
  title: item.title,
  children: mapObjectArrayFields(item.children, {
    label: 'name',
    value: 'token'
  })
}))

const emits = defineEmits(['update:value'])

const value = defineModel()

const onChange = () => {
  emits('update:value', value.value)
}
</script>
