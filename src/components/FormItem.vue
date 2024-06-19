<template>
  <component :is="getComponent()" v-model:value="value" v-bind="formItem.componentProps" @change="onChange" />
</template>

<script setup lang="ts">
import type { FormItem } from '@/types'
import { Input, Select, RadioGroup, CheckboxGroup } from 'ant-design-vue'
import InterfaceTokenRadioGroup from '@/components/InterfaceTokenRadioGroup.vue'
import ResponsePropertyKeyPath from '@/components/ResponsePropertyKeyPath.vue'

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  formItem: {
    type: Object as PropType<FormItem>,
    required: true
  },
  modelValue: {}
})

const value = ref()

watch(
  () => props.modelValue,
  (v) => {
    value.value = v
  },
  { immediate: true }
)

const onChange = () => {
  emits('update:modelValue', value.value)
}

const getComponent = () => {
  const component = props.formItem?.component
  switch (component) {
    case 'a-input':
      return Input
    case 'a-select':
      return Select
    case 'a-radio-group':
      return RadioGroup
    case 'a-checkbox-group':
      return CheckboxGroup
    case 'InterfaceTokenRadioGroup':
      return InterfaceTokenRadioGroup
    case 'response-property-key-path':
      return ResponsePropertyKeyPath
    default:
      return component || Input
  }
}
</script>
