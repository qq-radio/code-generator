import clonedeep from 'lodash.clonedeep'

export const parseStrings = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      try {
        obj[key] = JSON.parse(obj[key])
      } catch (error) {}
    } else if (typeof obj[key] === 'object') {
      parseStrings(obj[key])
    }
  }
}

export function getValueByPath(originObj, path) {
  let obj = clonedeep(originObj)
  const keys = path.split('.')

  for (const key of keys) {
    if (!obj || typeof obj !== 'object' || !obj.hasOwnProperty(key)) {
      return undefined
    }
    obj = obj[key]
  }

  return obj
}
