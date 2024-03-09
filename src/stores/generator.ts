const generatorStoreSetup = () => {
  const fetchParams = ref<any>({
    token: '',
    interfaceId: ''
  })
  const dataType = ref<any>({})

  const setFetchParams = (params: any) => {
    fetchParams.value = { ...params }
  }
  return { dataType, fetchParams, setFetchParams }
}

export const useGeneratorStoreSetup = defineStore('generatorStore', generatorStoreSetup, {
  persist: {
    paths: ['dataType']
  }
})
