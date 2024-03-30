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
      component: 'Select',
      componentProps: {
        defaultValue: 'Input',
        options: [
          {
            label: 'Input',
            value: 'Input'
          },
          {
            label: 'Select',
            value: 'Select'
          },
          {
            label: 'ChannelType',
            value: 'ChannelType',
            property: {
              options: 'TODO',
              fieldNames: {
                label: 'channelName',
                value: 'id'
              }
            }
          },
          {
            label: 'Dept',
            value: 'Dept',
            property: {
              treeData: 'TODO',
              fieldNames: {
                label: 'name',
                value: 'orgId',
                children: 'childOrgList'
              },
              placeholder: '请选择市场组织',
              showSearch: true,
              treeNodeFilterProp: 'name'
            }
          }
        ]
      }
    }
  ]
}

export default config
