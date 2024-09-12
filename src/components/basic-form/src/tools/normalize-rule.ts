import { getMessage } from './normalize-schema'
import { isArray } from 'remeda'

const TRIGGER: Form.RuleTrigger[] = ['change', 'blur']

function getRequiredRule(formItem: Form.SchemaItem) {
  return {
    required: true,
    message: getMessage(formItem)
  }
}

function getMinLimitRule(formItem: Form.SchemaItem): Form.Rule {
  return {
    trigger: TRIGGER,
    validator: (_rule, value, callback) => {
      if (formItem.minLimit && value?.length < formItem.minLimit) {
        callback(`请至少输入${formItem.minLimit}个文字`)
        return
      }
      callback()
    }
  }
}

function getMaxLimitRule(formItem: Form.SchemaItem): Form.Rule {
  return {
    trigger: TRIGGER,
    validator: (_rule, value, callback) => {
      if (formItem.maxLimit && value?.length > formItem.maxLimit) {
        callback(`最多可输入${formItem.maxLimit}个文字`)
        return
      }
      callback()
    }
  }
}

function normalizeRule(formItem: Form.SchemaItem) {
  const { required, minLimit, maxLimit } = formItem

  const rules = isArray(formItem.rules) ? formItem.rules : []

  if (required) {
    rules.push(getRequiredRule(formItem))
  }

  if (minLimit) {
    rules.push(getMinLimitRule(formItem))
  }

  if (maxLimit) {
    rules.push(getMaxLimitRule(formItem))
  }

  return {
    ...formItem,
    rules
  }
}

export { normalizeRule }
