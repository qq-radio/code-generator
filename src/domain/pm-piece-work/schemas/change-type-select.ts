import type { DomainFormSchema } from '@/components/basic-form/src/types/form'

export default {
  type: 'change-type-select',
  component: 'select',
  componentProps: {
    options: [],
    anyother: '第二个文件的测试 22'
  }
} satisfies DomainFormSchema
