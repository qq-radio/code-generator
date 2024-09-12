<template>
  <div class="inline-block">
    <a-select v-bind="$attrs" v-model="inputValue" :options="datas" @change="emitChange" />
  </div>
</template>

<script lang="ts" setup>
import { mapObjectArrayFields } from '@/utils'
import { isFunction, isArray, pathOr, stringToPath } from 'remeda'

const props = defineProps<{
  value: string | number | (string | number)[]
  api: () => Promise<any>
  resultField?: string
  labelField?: string
  valueField?: string
  isFreeze?: boolean
}>()

const emits = defineEmits<{
  (e: 'change', value: any, option: any): void
}>()

const datas = ref<any[]>([])
const inputValue = ref(props.value)

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
    const datas = props.resultField ? pathOr(result, stringToPath(props.resultField)) : result
    datas.value = handleDatas(datas)
  } catch (error) {
    console.error('CustomApiSelect Error:', error)
  }
}

query()

const handleDatas = (data: any[]) => {
  if (!isArray(data)) {
    return []
  }

  if (props.labelField && props.valueField) {
    return mapObjectArrayFields(data, {
      label: props.labelField,
      value: props.valueField
    })
  }

  return []
}

const emitChange = (value: any, option: any) => {
  const valueItem = option?.data?.props || {}
  emits('change', value, valueItem)
}
</script>
