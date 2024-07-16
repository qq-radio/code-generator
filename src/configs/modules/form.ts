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
        // 配置其实还是可以放在这里配置，只是说渲染到propertypanel时候要去除掉 不然会超级卡
        // options: [
        //   {
        //     label: 'input',
        //     value: 'input'
        //   },
        //   {
        //     label: 'input-number',
        //     value: 'input-number'
        //   },
        //   {
        //     label: 'textarea',
        //     value: 'textarea'
        //   },
        //   {
        //     label: 'select',
        //     value: 'select'
        //   },
        //   {
        //     label: 'date-picker',
        //     value: 'date-picker'
        //   },
        //   {
        //     label: 'time-picker',
        //     value: 'time-picker'
        //   }
        //   // 这个我用不到只是想说之前我预留了这个样的功能，啊 我很快就要看不懂自己写的什么代码了啊 啊
        //   // {
        //   //   label: 'ChannelType',
        //   //   value: 'ChannelType',
        //   //   property: {
        //   //     options: 'TODO',
        //   //     fieldNames: {
        //   //       label: 'channelName',
        //   //       value: 'id'
        //   //     }
        //   //   }
        //   // },
        // ]
      }
    },
    {
      field: 'type',
      component: 'Select',
      componentProps: {
        // options: [
        //   {
        //     label: 'base-select',
        //     value: 'base-select'
        //   },
        //   {
        //     label: 'change-type-select',
        //     value: 'change-type-select'
        //   },
        //   {
        //     label: 'forklift-driver-type-select',
        //     value: 'forklift-driver-type-select'
        //   },
        //   {
        //     label: 'gyl-dept-tree-select',
        //     value: 'gyl-dept-tree-select'
        //   },
        //   {
        //     label: 'prod-line-select',
        //     value: 'prod-line-select'
        //   },
        //   {
        //     label: 'shift-select',
        //     value: 'shift-select'
        //   },
        //   {
        //     label: 'storage-type-select',
        //     value: 'storage-type-select'
        //   }
        // ]
      }
    },
    {
      field: 'required',
      component: 'Checkbox'
    }
  ]
}

export default config
