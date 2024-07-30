<template>
  <div class="basic-form">
    <a-form-model ref="formModelRef" :model="formModel">
      <a-row :gutter="layout.gutter">
        <template v-for="schemaItem in formSchema">
          <template v-if="schemaItem.component === 'sub-title'">
            <div class="tw-mb-3 tw-ml-20 tw-font-bold tw-text-lg" :key="schemaItem.prop">
              {{ schemaItem.label }}
            </div>
          </template>
          <template v-else>
            <a-col v-if="getVIf(schemaItem)" v-bind="getCol(schemaItem)" :key="schemaItem.prop">
              <a-form-model-item
                v-bind="schemaItem.itemProps"
                :prop="schemaItem.prop"
                :label="schemaItem.label"
                :labelCol="getLabelCol(schemaItem)"
                :wrapperCol="getWrapperCol(schemaItem)"
                :rules="schemaItem.rules"
              >
                <slot v-if="schemaItem.slot" :name="schemaItem.slot" :model="formModel" style="width: 100%" />
                <component
                  v-else
                  :is="getComponent(schemaItem)"
                  v-model="formModel[schemaItem.prop]"
                  v-bind="getComponentProps(schemaItem)"
                  v-on="getComponentListeners(schemaItem)"
                  style="width: 100%"
                  @change="(...v) => onChange(schemaItem, v)"
                />
                <div v-if="schemaItem.maxLimit" class="tw-text-right">
                  {{ getLimitText(schemaItem) }}
                </div>
              </a-form-model-item>
            </a-col>
          </template>
        </template>
      </a-row>
    </a-form-model>
  </div>
</template>

<script setup lang="ts">
import { getComponent } from './tools/register-material'
import { normalizeSchema } from './tools/normalize-schema'
import { mapObjectArrayFields } from '@/utils'
import { formatTime } from '@/utils/time'
import { isPlainObject, isFunction, isNullish, isObject, isArray, merge } from 'remeda'
import type { FormSchema, FormLayout } from './types/form'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  layout: {
    type: Object as () => FormLayout,
    default: () => ({
      col: { span: 24 },
      labelCol: { xs: { span: 24 }, sm: { span: 5 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
    })
  },
  schema: { type: Array as () => FormSchema[], default: () => [] }
})

const formModelRef = ref()
const formSchema = ref<FormSchema[]>([])
const formModel = reactive<Record<string, any>>({})

const setDefaultFormModel = () => {
  const defaultFormModel: Record<string, any> = {}
  formSchema.value.forEach((formItem) => {
    defaultFormModel[formItem.prop] = formItem.componentProps?.defaultValue
  })
  Object.assign(formModel, defaultFormModel)
}

watch(
  () => props.schema,
  (newSchema) => {
    formSchema.value = normalizeSchema(newSchema)
    setDefaultFormModel()
  },
  { immediate: true }
)

const getForm = () => formModelRef.value

const getVIf = (schemaItem: FormSchema) => {
  const { hidden, vIf } = schemaItem
  if (hidden) return false
  if (isFunction(vIf)) return vIf(formModel, schemaItem)
  return isNullish(vIf) ? true : vIf
}

const getCol = (schemaItem: FormSchema) => schemaItem.colConfig?.col || props.layout.col
const getLabelCol = (schemaItem: FormSchema) => schemaItem.colConfig?.labelCol || props.layout.labelCol
const getWrapperCol = (schemaItem: FormSchema) => schemaItem.colConfig?.wrapperCol || props.layout.wrapperCol

const getComponent = (schemaItem: FormSchema) => getComponent(schemaItem.component)

const getComponentProps = (schemaItem: FormSchema) => {
  const { componentProps = {} } = schemaItem
  if (!isPlainObject(componentProps)) return componentProps
  return { ...componentProps, disabled: getDisabled(schemaItem), options: getOptions(schemaItem) }
}

const getDisabled = (schemaItem: FormSchema) => {
  const { disabled } = schemaItem.componentProps
  if (isNullish(disabled)) return props.disabled
  if (isFunction(disabled)) return disabled({ formModel, schemaItem })
  return disabled
}

const getOptions = (schemaItem: FormSchema) => {
  if (schemaItem.component !== 'select') return
  const { options, labelField, valueField } = schemaItem.componentProps
  let realOptions = []

  if (isFunction(options)) {
    realOptions = options({ formModel, schemaItem })
  }

  if (isArray(options)) {
    realOptions = options
  }

  if (labelField && valueField) {
    realOptions = mapObjectArrayFields(options, { label: labelField, value: valueField })
  }

  return realOptions
}

const getComponentListeners = (schemaItem: FormSchema) => {
  const { componentListeners } = schemaItem
  if (isFunction(componentListeners)) {
    return componentListeners(getFormActions()) || {}
  }
  return componentListeners || {}
}

const getLimitText = (schemaItem: FormSchema) => {
  return (formModel[schemaItem.prop]?.length || 0) + '/' + schemaItem.maxLimit
}

const getFormActions = () => ({
  validate: validate,
  validateField: validateField,
  resetFields: resetFields,
  clearValidate: clearValidate
})

const onSelectChange = (schemaItem: FormSchema, event: any) => {
  const { componentProps: { mode, extraFields } = {} } = schemaItem
  if (mode === 'multiple') return
  if (!isArray(extraFields)) return

  const [_value, valueItem] = event
  extraFields.forEach((fields) => {
    const newFieldName = fields[0]
    const oldFieldName = fields[1] || fields[0]

    if (!newFieldName && !oldFieldName) return
    setFieldsValue({ [newFieldName]: valueItem[oldFieldName] })
  })
}

const onTreeSelectChange = (schemaItem: FormSchema, event: any) => {
  const { componentProps: { mode, extraFields } = {} } = schemaItem
  if (mode === 'multiple') return
  if (!isArray(extraFields)) return

  const [_value, valueItem] = event
  extraFields.forEach((fields) => {
    const newFieldName = fields[0]
    const oldFieldName = fields[1] || fields[0]

    if (!newFieldName && !oldFieldName) return
    setFieldsValue({ [newFieldName]: valueItem[oldFieldName] })
  })
}

const onTimeRangeChange = (schemaItem: FormSchema, event: any) => {
  const { componentProps: { timeRangeMapFields, format } = {} } = schemaItem
  if (!isArray(timeRangeMapFields)) return

  const [startDate, endDate] = timeRangeMapFields
  const [value] = event

  if (!value && !startDate && !endDate) return
  setFieldsValue({
    [startDate]: formatTime(value[0], format),
    [endDate]: formatTime(value[1], format)
  })
}

const onChange = (schemaItem: FormSchema, event: any) => {
  if (['select', 'api-select'].includes(schemaItem.component)) {
    onSelectChange(schemaItem, event)
  }

  if (['api-tree-select'].includes(schemaItem.component)) {
    onTreeSelectChange(schemaItem, event)
  }

  if (['range-picker'].includes(schemaItem.component)) {
    onTimeRangeChange(schemaItem, event)
  }
}

const resetFields = () => {
  getForm().resetFields()
}

const setFieldsValue = (values: Record<string, any>) => {
  if (!isObject(values)) return

  for (const [field, value] of Object.entries(values)) {
    formModel[field] = value
  }
}

const getFieldsValue = (field?: string) => {
  return field ? formModel[field] : formModel
}

const clearValidate = (field?: string) => {
  getForm().clearValidate(field)
}

const validate = (callback: (model: Record<string, any>) => void) => {
  getForm().validate((valid: boolean, errors: any) => {
    console.log('Form validation:', valid, errors)
    console.log('Form values:', formModel)
    if (valid) {
      callback(formModel)
    }
  })
}

const validateField = (fields: string | string[]) => {
  getForm().validateField(fields)
}

const getSchemaItemIndex = (prop: string) => {
  return formSchema.value.findIndex((schemaItem) => schemaItem.prop === prop)
}

const updateSchema = (schemaItem: FormSchema) => {
  const targetIndex = getSchemaItemIndex(schemaItem.prop)
  const newSchemaItem = merge(formSchema.value[targetIndex], schemaItem)
  formSchema.value.splice(targetIndex, 1, newSchemaItem)
}
</script>

<style lang="less" scoped>
.basic-form {
  overflow-y: auto;
  max-height: 68vh;
}
</style>
