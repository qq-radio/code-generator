import type { DomainFormSchema } from '@/components/basic-form/src/types/form'

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
} satisfies DomainFormSchema
