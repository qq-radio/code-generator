import type { FormSchemaItem, TableSchemaItem } from '@/types'
import { excludeObjectUndefinedProps } from '@/utils'

type AntdTableSchemaItem = {
  title?: string
  dataIndex?: string
  visible?: boolean
  // for table search
  searchAble?: boolean
  type?: string // -> component
  fieldName?: string
  fieldLabel?: string
}

function getAntdType(component: string) {
  switch (component) {
    case 'Input':
      return 'text'
    case 'Select':
      return 'select'
    default:
      break
  }
}

export function formatAntdTableSchemas(schemas: TableSchemaItem[]): AntdTableSchemaItem[] {
  return schemas.map((schema) => {
    const { title, dataIndex, ifShow, searchConfig } = schema
    if (!searchConfig) {
      return {
        title,
        dataIndex
      }
    }
    if (ifShow === false && searchConfig) {
      return {
        visible: false,
        searchAble: true,
        type: getAntdType(searchConfig.component),
        fieldName: searchConfig.field,
        fieldLabel: searchConfig.label
      }
    }
    return {
      title,
      dataIndex,
      searchAble: true,
      type: getAntdType(searchConfig.component),
      fieldName: searchConfig.field
    }
  })
}

type AntdFormSchemaItem = {
  label: string
  prop: string
  component?: string
  required?: boolean
}

function getAntdComponent(component: string) {
  switch (component) {
    case 'Input':
      return 'input'
    case 'Select':
      return 'select'
    default:
      break
  }
}

export function formatAntdFormSchemas(schemas: FormSchemaItem[]): AntdFormSchemaItem[] {
  return schemas.map((schema) => {
    const { field, component, ...rest } = schema
    return excludeObjectUndefinedProps({
      prop: field,
      component: getAntdComponent(schema.component),
      ...rest
    })
  })
}
