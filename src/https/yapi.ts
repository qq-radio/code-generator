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
    // 就这样吧，先就这样吧，打补丁 哪里需要打哪里
    const { data: result } = await axios.get(url, options)
    return {
      ...result,
      data: {
        ...result.data,
        ...parseJson({ res_body: result.data.res_body }),
        ...parseJson({ req_body_other: result.data.req_body_other })
      }
    }
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
