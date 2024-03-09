import type { Config } from '@/types'

const config: Config = {
  codeType: 'FORM',
  sort: 2,
  responsePropertyKeyPath: 'data.res_body.properties.data.properties',
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
      component: 'Input',
      componentProps: {
        options: [
          {
            label: 'INPUT',
            value: 'INPUT'
          },
          {
            label: 'SELECT',
            value: 'SELECT'
          }
        ]
      }
    }
  ]
}

export default config
