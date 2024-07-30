import type { FormSchema, FormSchemaItem } from '@/components/basic-form/src/types/form'
import { getComponentPrefix } from './get-component'
import { getSchema } from './register-schema'
import { normalizeRule } from './normalize-rule'
import { merge } from 'remeda'

function getMessage(formItem: FormSchemaItem) {
  return getComponentPrefix(formItem.component) + formItem.label
}

function getPlaceholder(formItem: FormSchemaItem) {
  if (formItem.component === 'range-picker') {
    return ['开始时间', '结束时间']
  }
  return getMessage(formItem)
}

function addFormItemPlaceholder(formItem: FormSchemaItem) {
  return merge(
    {
      componentProps: {
        placeholder: getPlaceholder(formItem)
      }
    },
    formItem
  )
}

function addFormItemAllowClear(formItem: FormSchemaItem) {
  return merge(
    {
      componentProps: {
        allowClear: true
      }
    },
    formItem
  )
}

function addFormItemSchema(formItem: FormSchemaItem) {
  if (formItem.type) {
    return merge(getSchema(formItem.type), formItem)
  }

  return formItem
}

function addFormItemTimeFormat(formItem: FormSchemaItem) {
  if (formItem.component === 'range-picker') {
    return merge(
      {
        componentProps: {
          format: formItem?.componentProps?.format || 'YYYY-MM-DD',
          valueFormat: formItem?.componentProps?.valueFormat || 'YYYY-MM-DD'
        }
      },
      formItem
    )
  }

  return formItem
}

function filterSchema(schema: FormSchema) {
  return schema.filter((schemaItem) => schemaItem.prop)
}

function sortSchema(schema: FormSchema) {
  return schema.sort((a, b) => (a.sort || 0) - (b.sort || 0))
}

function normalizeSchemaItem(schemaItem: FormSchemaItem) {
  return [
    addFormItemSchema,
    addFormItemPlaceholder,
    addFormItemAllowClear,
    addFormItemTimeFormat,
    normalizeRule
  ].reduce((acc, func) => func(acc), schemaItem)
}

function normalizeSchema(schema: FormSchema) {
  return sortSchema(filterSchema(schema)).map(normalizeSchemaItem)
}

export { getMessage, normalizeSchema }
