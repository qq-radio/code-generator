import { parseJson } from '@/utils'
import axios from 'axios'

type GetApiOption = {
  projectToken: string
  interfaceId: string | number
}

export const yapiInterfaceGetApi = async (option: GetApiOption) => {
  try {
    const { projectToken, interfaceId } = option
    const url = `/yapiServer/interface/get?token=${projectToken}&id=${interfaceId}`
    const options = {
      headers: {
        'Content-type': 'application/json'
      }
    }
    const { data } = await axios.get(url, options)
    parseJson(data)
    return data
  } catch (error) {
    console.error(`yapiInterfaceGetApi error：${error}`)
  }
}

type ListApiOption = {
  projectToken: string
  catId: string | number
}
export const yapiInterfaceListApi = async (option: ListApiOption) => {
  try {
    const { projectToken, catId } = option
    const url = `/yapiServer/interface/list_cat?page=1&limit=40&token=${projectToken}&catid=${catId}`
    const options = {
      headers: {
        'Content-type': 'application/json'
      }
    }
    const { data } = await axios.get(url, options)
    return data
  } catch (error) {
    console.error(`yapiInterfaceListApi error：${error}`)
  }
}
