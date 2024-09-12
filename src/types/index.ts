export type CodeType = 'TABLE' | 'FORM' | 'DESCRIPTION'

export type Framework = 'VBEN' | 'ANTD'

export type PropertyType = 'REQUEST' | 'RESPONSE'

export type PropertyValue = {
  type: string
  description: string
}

export type Properties = {
  [key: string]: PropertyValue
}

export type AnyObject = {
  [key: string]: any
}

export type GlobalConfig = {
  codeType: CodeType
  projectToken: string
  interfaceId: string
  requestPropertyKeyPath: string
  responsePropertyKeyPath: string
  downloadFileName: {
    interface: string
    schema: string
  }
}

export type SettingConfigItem = {
  field: string
  component: string
  componentProps?: Record<string, any>
  defaultValueFromField?: string
}

export type Config = {
  codeType: string
  sort: number
  responsePropertyKeyPath: string
  requestSettingConfig?: SettingConfigItem[]
  responseSettingConfig?: SettingConfigItem[]
}

export type DataSourceItem = SettingConfigItem & { value: string }

export type FormItemComponent =
  | 'a-input'
  | 'a-select'
  | 'a-radio-group'
  | 'a-checkbox-group'
  | 'InterfaceTokenRadioGroup'
  | 'response-property-key-path'

export type FormItem = {
  label: string
  field: string
  component?: string
  componentProps?: {
    disabled: boolean
  } & AnyObject
}

export type Method = 'GET' | 'POST' | 'DELETE'

export type ApiItem = {
  title: string
  method: Method
  path: string
}

export type SchemaItem = {
  label: string
  field: string
  component: string
}

export type TableSchemaItem = {
  title: string
  dataIndex: string
  ifShow?: boolean
  searchConfig?: SchemaItem
}
