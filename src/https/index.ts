import { parseJson } from '@/utils'
import axios from 'axios'

type Option = {
  yapiDomain: string
  projectToken: string
  interfaceId: string | number
}
export const axiosFetch = async (option: Option) => {
  try {
    const { yapiDomain, projectToken, interfaceId } = option
    const url = `${yapiDomain}?token=${projectToken}&id=${interfaceId}`
    const options = {
      headers: {
        'Content-type': 'application/json'
      }
    }
    const { data } = await axios.get(url, options)
    parseJson(data)
    return data
  } catch (error) {
    console.error(`获取接口：${error}`)
  }
}
