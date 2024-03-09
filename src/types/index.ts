export type CodeType = 'TABLE' | 'FORM' | 'DESCRIPTION'

export type PropertyType = 'REQUEST' | 'RESPONSE'

export type PropertyValue = {
  type: string
  description: string
}

export type Properties = {
  [key: string]: PropertyValue
}

export type GlobalConfig = {
  codeType: CodeType
  yapiDomain: string
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
