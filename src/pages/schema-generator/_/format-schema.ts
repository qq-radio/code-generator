import type { FormSchemaItem, TableSchemaItem } from '@/types'
import { excludeObjectUndefinedProps } from '@/utils'

type SearchConfig = {
  label: string
  prop: string
  type?: string
  component?: string
}

type AntdTableSchemaItem = {
  title?: string
  dataIndex?: string
  visible?: boolean
  searchConfig?: SearchConfig
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

    let newSearchConfig: SearchConfig = {}

    newSearchConfig.label = searchConfig.label
    newSearchConfig.prop = searchConfig.field

    if (searchConfig.component) {
      newSearchConfig.component = searchConfig.component
    }

    if (searchConfig.type) {
      newSearchConfig.type = searchConfig.type
    }

    if (searchConfig.required) {
      newSearchConfig.required = searchConfig.required
    }

    return ifShow === false
      ? {
          visible: false,
          searchConfig: newSearchConfig
        }
      : {
          title,
          dataIndex,
          searchConfig: newSearchConfig
        }
  })
}

type AntdFormSchemaItem = {
  label: string
  prop: string
  component?: string
  required?: boolean
}

export function formatAntdFormSchemas(schemas: FormSchemaItem[]): AntdFormSchemaItem[] {
  return schemas.map((schema) => {
    const config = {
      label: schema.label,
      prop: schema.field
    }

    if (schema.component) {
      config.component = schema.component
    }

    if (schema.type) {
      config.type = schema.type
    }

    if (schema.required) {
      config.required = schema.required
    }

    return config
  })
}
