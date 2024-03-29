import { clone } from 'remeda'

export const parseJson = (obj: Record<string, any>): Record<string, any> => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      try {
        obj[key] = JSON.parse(obj[key])
      } catch (error) {
        console.log(error)
      }
    } else if (typeof obj[key] === 'object') {
      parseJson(obj[key])
    }
  }
  return obj
}

export function getValueByPath<T>(originObj: T, path: string): any {
  let obj: any = clone(originObj)
  const keys = path.split('.')

  for (const key of keys) {
    if (!obj || typeof obj !== 'object' || !Object.prototype.hasOwnProperty.call(obj, key)) {
      return undefined
    }
    obj = obj[key]
  }

  return obj
}

export function checkNotEmptyKeyValue(obj: Record<string, any>): boolean {
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

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
