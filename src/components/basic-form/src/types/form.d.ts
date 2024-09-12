declare namespace Form {
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

  export type ComponentType = AntdComponentType | CustomComponentType

  interface ComponentTypeGroup {
    antdComponent: AntdComponentType[]
    customComponent: CustomComponentType[]
  }

  export type RuleTrigger = 'change' | 'blur'
  interface RuleValidator {
    (rule: any, value: any, callback: (message?: string) => void): any
  }

  interface Rule {
    message?: string
    required?: boolean
    trigger?: RuleTrigger[]
    validator?: RuleValidator
  }

  interface Col {
    span: number
    offset: number
  }

  interface FormLayout {
    col: Col
    labelCol: Col
    wrapperCol: Col
  }

  interface Option {
    label: string
    value: string
  }

  interface TimeRangeMapFields extends Array<string> {
    0: string
    1: string
  }

  interface ComponentProps extends Recordable {
    api?: Function
    options?: Option[]
    disabled?: boolean | ((opt: { formModel: Recordable; schemaItem: SchemaItem }) => boolean)
    extraFields?: string[][]
    timeRangeMapFields?: TimeRangeMapFields
  }

  interface SchemaItem {
    label: string
    prop: string
    type?: SchemaType
    itemProps?: Recordable
    component: AntdComponentType | CustomComponentType
    componentProps?: ComponentProps
    componentListeners?: Recordable<Function>
    slot?: string
    layout?: FormLayout
    required?: boolean
    minLimit?: number
    maxLimit?: number
    rules?: Rule[]
    hidden?: boolean
    vIf?: (model: any, formSchemaItem: SchemaItem, schemaItemIndex: number) => boolean
    sort?: number
  }

  interface DomainSchemaItem extends Partial<SchemaItem> {}

  interface Schema extends Array<SchemaItem> {}
}
