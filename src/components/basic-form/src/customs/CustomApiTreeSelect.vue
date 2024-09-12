<template>
  <a-tree-select v-bind="$attrs" v-model="inputValue" :treeData="datas" style="width: 100%" @change="emitChange" />
</template>

<script lang="ts" setup>
import { isFunction, pathOr, stringToPath } from 'remeda'

const props = defineProps<{
  value: string | number | (string | number)[]
  api: () => Promise<any>
  resultField?: string
  labelField?: string
  valueField?: string
}>()

const emit = defineEmits<{
  (e: 'change', value: any, target: any): void
}>()

const datas = ref<any[]>([])
const inputValue = ref<any>()

watch(
  () => props.value,
  (newValue) => {
    inputValue.value = newValue
  },
  { immediate: true }
)

const query = async () => {
  try {
    if (!isFunction(props.api)) {
      throw new Error('api should be a function')
    }

    const result = await props.api()
    datas.value = props.resultField ? pathOr(result, stringToPath(props.resultField)) : result
  } catch (error) {
    console.error('CustomApiTreeSelect Error:', error)
  }
}
query()

const emitChange = (value: any, _label: any, extra: any) => {
  const target = extra?.triggerNode?.dataRef || {}
  emit('change', value, target)
}
</script>
