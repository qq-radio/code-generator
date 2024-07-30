export type SchemaType =
  | 'gyl-dept-tree-select'
  | 'base-select'
  | 'prod-line-select'
  | 'shift-select'
  | 'change-export type-select'
  | 'storage-export type-select'
  | 'forklift-driver-export type-select'

export type AntdComponentType =
  | 'input'
  | 'input-number'
  | 'input-password'
  | 'textarea'
  | 'switch'
  | 'radio-group'
  | 'checkbox-group'
  | 'select'
  | 'tree-select'
  | 'date-picker'
  | 'time-picker'
  | 'month-picker'
  | 'range-picker'
  | 'cascader'

export type CustomComponentType =
  | 'sub-title'
  | 'input-number-range'
  | 'api-select'
  | 'api-tree-select'
  | 'month-range-picker'
  | 'range-picker-with-disabled'

export type AllComponentType = AntdComponentType | CustomComponentType

export interface ComponentGroupType<T> {
  input: Partial<T>[]
  select: Partial<T>[]
}

export interface AllComponent {
  antdComponent: ComponentGroupType<AntdComponentType>
  customComponent: ComponentGroupType<CustomComponentType>
}

export type RuleTrigger = 'change' | 'blur'
export type RuleValidator = (rule: any, value: any, callback: (message?: string) => void) => any

export type Rule = {
  message?: string
  required?: boolean
  trigger?: RuleTrigger[]
  validator?: RuleValidator
}

export type Col = {
  span: number
  offset: number
}

export type FormLayout = {
  col: Col
  labelCol: Col
  wrapperCol: Col
}

export type Option = {
  label: string
  value: string
}

export type Recordable<T = any> = Record<string, T>

export type TimeRangeMapFields = [string, string]

export type ComponentProps = {
  api?: Function
  options?: Option[]
  disabled?: boolean | ((opt: { formModel: Recordable; schemaItem: FormSchemaItem }) => boolean)
  extraFields?: string[][]
  timeRangeMapFields?: TimeRangeMapFields
} & Recordable

export interface FormSchemaItem {
  label: string
  prop: string
  type?: SchemaType
  component: AntdComponentType | CustomComponentType
  itemProps?: Recordable
  componentProps?: ComponentProps
  componentListeners?: Recordable<Function>
  slot?: string
  layout?: FormLayout
  required?: boolean
  minLimit?: number
  maxLimit?: number
  rules?: Rule[]
  hidden?: boolean
  vIf?: (model: any, FormSchemaItem: FormSchemaItem, schemaItemIndex: number) => boolean
  sort?: number
}

export type FormSchema = FormSchemaItem[]

export type DomainFormSchema = Partial<FormSchemaItem>
