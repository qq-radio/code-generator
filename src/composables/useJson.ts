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
  return obj
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

export function pickObjectProps<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const pickedObj = {} as Pick<T, K>
  keys.forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      pickedObj[key] = obj[key]
    }
  })
  return pickedObj
}

export function checkNotEmptyKeyValue(obj: { [key: string]: any }): boolean {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (value === null || value === undefined || value === '') {
        return false
      }
    }
  }
  return true
}
