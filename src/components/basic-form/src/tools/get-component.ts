import allComponent from '../component'

function isAntdComponent(component: Form.ComponentType): component is Form.AntdComponentType {
  return allComponent.antdComponent.includes(component as Form.AntdComponentType)
}

function isCustomComponent(component: Form.ComponentType): component is Form.CustomComponentType {
  return allComponent.customComponent.includes(component as Form.CustomComponentType)
}

function getComponentType(component: Form.ComponentType) {
  if (isAntdComponent(component)) {
    return 'a-' + component
  }

  if (isCustomComponent(component)) {
    return 'custom' + component
  }

  return ''
}

function getComponentPrefix(component: Form.ComponentType) {
  let prefix
  switch (component) {
    case 'input':
    case 'input-number':
    case 'input-password':
    case 'textarea':
    case 'input-number-range':
      prefix = '请输入'
      break
    case 'switch':
    case 'radio-group':
    case 'checkbox-group':
    case 'select':
    case 'tree-select':
    case 'date-picker':
    case 'time-picker':
    case 'month-picker':
    case 'range-picker':
    case 'cascader':
    case 'api-select':
    case 'api-tree-select':
    case 'month-range-picker':
    case 'cascader':
    case 'range-picker-with-disabled':
      prefix = '请选择'
      break
    default:
      prefix = '请输入'
      break
  }

  return prefix
}

export { getComponentType, getComponentPrefix }
