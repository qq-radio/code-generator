import type { Config } from '@/types'

const config: Config = {
  codeType: 'TABLE',
  sort: 1,
  responsePropertyKeyPath: 'data.res_body.properties.data.properties.records.items.properties',
  requestSettingConfig: [
    {
      field: 'label',
      component: 'Input',
      defaultValueFromField: 'description'
    },
    {
      field: 'field',
      component: 'Input',
      componentProps: {
        disabled: true
      },
      defaultValueFromField: 'key'
    },
    {
      field: 'component',
      component: 'Input'
    }
  ],
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
