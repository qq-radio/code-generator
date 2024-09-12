import { getComponentPrefix } from './get-component'
import { getSchema } from './register-schema'
import { normalizeRule } from './normalize-rule'
import { merge } from 'remeda'

function getMessage(formItem: Form.SchemaItem) {
  return getComponentPrefix(formItem.component) + formItem.label
}

function getPlaceholder(formItem: Form.SchemaItem) {
  if (formItem.component === 'range-picker') {
    return ['开始时间', '结束时间']
  }
  return getMessage(formItem)
}

function addFormItemPlaceholder(formItem: Form.SchemaItem) {
  return merge(
    {
      componentProps: {
        placeholder: getPlaceholder(formItem)
      }
    },
    formItem
  )
}

function addFormItemAllowClear(formItem: Form.SchemaItem) {
  return merge(
    {
      componentProps: {
        allowClear: true
      }
    },
    formItem
  )
}

function addFormItemSchema(formItem: Form.SchemaItem) {
  if (formItem.type) {
    return merge(getSchema(formItem.type), formItem)
  }

  return formItem
}

function addFormItemTimeFormat(formItem: Form.SchemaItem) {
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

function filterSchema(schema: Form.Schema) {
  return schema.filter((schemaItem) => schemaItem.prop)
}

function sortSchema(schema: Form.Schema) {
  return schema.sort((a, b) => (a.sort || 0) - (b.sort || 0))
}

function normalizeSchemaItem(schemaItem: Form.SchemaItem) {
  return [
    addFormItemSchema,
    addFormItemPlaceholder,
    addFormItemAllowClear,
    addFormItemTimeFormat,
    normalizeRule
  ].reduce((acc, func) => func(acc), schemaItem)
}

function normalizeSchema(schema: Form.Schema) {
  return sortSchema(filterSchema(schema)).map(normalizeSchemaItem)
}

export { getMessage, normalizeSchema }
