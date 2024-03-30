import type { Config } from '@/types'
import formConfig from './form'

const config: Config = {
  codeType: 'TABLE',
  sort: 1,
  responsePropertyKeyPath: 'data.res_body.properties.data.properties.records.items.properties',
  requestSettingConfig: formConfig.requestSettingConfig,
  responseSettingConfig: [
    {
      field: 'title',
      component: 'Input',
      defaultValueFromField: 'description'
    },
    {
      field: 'dataIndex',
      component: 'Input',
      componentProps: {
        disabled: true
      },
      defaultValueFromField: 'key'
    }
  ]
}

export default config
