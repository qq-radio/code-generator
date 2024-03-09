import type { Config } from '@/types'

const config: Config = {
  codeType: 'DESCRIPTION',
  sort: 3,
  responsePropertyKeyPath: 'data.res_body.properties.data.properties',
  responseSettingConfig: [
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
    }
  ]
}

export default config
