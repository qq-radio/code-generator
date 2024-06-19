import axios from 'axios'

let TOKEN = ''

export const loginApi = async () => {
  try {
    const url = `/adminServer/user/login/in`
    const options = {
      headers: {
        'Content-type': 'application/json'
      }
    }
    const params = {
      userAccount: 'admin',
      password: '888888'
    }
    const { data } = await axios.post(url, params, options)
    TOKEN = data.data.token
  } catch (error) {
    console.error(`loginApi error：${error}`)
  }
}

export const adminInterfaceGetApi = async (id) => {
  try {
    await loginApi()

    const url = `/adminServer/user/sys/permission/${id}`
    const options = {
      headers: {
        'Content-type': 'application/json',
        token: TOKEN
      }
    }
    const { data } = await axios.get(url, options)

    return data.data || {}
  } catch (error) {
    console.error(`adminServer error：${error}`)
  }
}

export const adminInterfacePostApi = async (params) => {
  try {
    const url = `/adminServer/user/sys/permission`
    const options = {
      headers: {
        'Content-type': 'application/json',
        token: TOKEN
      }
    }
    const { data } = await axios.post(url, params, options)
    return data
  } catch (error) {
    console.error(`adminServer error：${error}`)
  }
}

export const adminServerTestInterfaceGetApi = async (id) => {
  try {
    const url = `/adminServerTest/user/sys/permission/${id}`

    console.log('url:', url)

    const options = {
      headers: {
        'Content-type': 'application/json',
        token: '111'
      }
    }
    const { data } = await axios.get(url, options)
    console.log('data:', data)
    return data.data || {}
  } catch (error) {
    console.error(`adminServerTest error：${error}`)
  }
}

export const adminServerTestInterfacePostApi = async (params) => {
  try {
    const url = `/adminServerTest/user/sys/permission`
    const options = {
      headers: {
        'Content-type': 'application/json',
        token: TOKEN
      }
    }
    const { data } = await axios.post(url, params, options)
    return data
  } catch (error) {
    console.error(`adminServerTest error：${error}`)
  }
}
