import allComponent from '../component'
import type { AllComponentType } from '@/components/basic-form/src/types/form'
import { kebabToCamelCase } from '@/utils'

function getComponentType(component: AllComponentType) {
  const antdComponent = [...allComponent.antdComponent.input, ...allComponent.antdComponent.select]
  const isAntd = antdComponent.includes(component)
  if (isAntd) {
    return 'a-' + component
  }

  const customComponent = [...allComponent.customComponent.input, ...allComponent.customComponent.select]
  const isCustom = customComponent.includes(component)
  if (isCustom) {
    return 'Custom' + kebabToCamelCase(component)
  }

  return 'a-input'
}

function getComponentPrefix(component: AllComponentType) {
  const inputs = [...allComponent.antdComponent.input, ...allComponent.customComponent.input]
  if (inputs.includes(component)) {
    return '请输入'
  }

  const selects = [...allComponent.antdComponent.select, ...allComponent.customComponent.select]
  if (selects.includes(component)) {
    return '请选择'
  }

  return '请输入'
}

export { getComponentType, getComponentPrefix }
