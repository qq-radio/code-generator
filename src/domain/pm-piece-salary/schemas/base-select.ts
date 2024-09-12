export default {
  type: 'base-select',
  component: 'api-select',
  componentProps: {
    api: () => {},
    resultField: 'result',
    labelField: 'departName',
    valueField: 'id',
    anyother: '第1个文件 1111'
  }
} satisfies Form.DomainSchemaItem
