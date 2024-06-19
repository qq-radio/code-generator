<template>
  <div>
    <a-form labelAlign="left" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }">
      <a-form-item v-for="(formItem, index) in props.formConfigs" :key="index" :label="formItem.label">
        <component :is="getComponent(formItem)" v-model:value="formValues[formItem.field]" v-bind="formItem.componentProps" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Form'
}
</script>
<script setup lang="ts">
import { Input, Select, RadioGroup, CheckboxGroup } from 'ant-design-vue'

const props = defineProps({
  formConfigs: { type: Array, required: true }
})

type FormValues = {
  parentId: string
  parentCode: string
  parentName: string
  codes: string[]
  [key: string]: string | string[]
}

const formValues: Ref<FormValues | undefined> = ref({})

const getComponent = (formItem) => {
  const component = formItem?.component || 'a-input'
  console.log('component:1', component)
  switch (component) {
    case 'a-input':
      return Input
    case 'a-select':
      return Select
    case 'a-radio-group':
      return RadioGroup
    case 'a-checkbox-group':
      return CheckboxGroup
    default:
      return component || ''
  }
}
</script>
