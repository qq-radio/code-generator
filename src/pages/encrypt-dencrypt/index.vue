<route lang="json">
{
  "meta": {
    "sort": 5
  }
}
</route>

<template>
  <div class="m-5 h-screen w-screen overflow-y-auto overflow-x-hidden p-2.5">
    <a-collapse v-model:activeKey="activeKey" class="w-11/12">
      <a-collapse-panel key="configure-panel" header="Configure panel">
        <a-form labelAlign="left" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }">
          <a-form-item v-for="(formItem, index) in formConfigs" :key="index" :label="formItem.label">
            <a-input v-model:value="formValues[formItem.field]" v-bind="formItem.componentProps" />
          </a-form-item>
        </a-form>
        <div>加密后的门店编码 {{ result }}</div>
        <div>快速生成二维码参数 {{ qrcode }}</div>
      </a-collapse-panel>
      <a-collapse-panel key="response-panel" header="Request panel">wait</a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SchemaGeneratorIndex'
}
</script>
<script setup lang="ts">
import { generateApiFile } from '@/utils/generate'
import { downloadJavascript } from '@/utils/download'
import { checkNotEmptyKeyValue, filterObjectByKey } from '@/utils'
import type { FormItem, ApiItem } from '@/types'
import { yapiInterfaceListApi } from '@/https/yapi'
import { DownloadOutlined, RightOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { AES, enc, pad, mode } from 'crypto-js'

const result = ref('')

const qrcode = computed(() =>
  result.value
    ? `https://uat-by-gw.bygf.top?type=redirect&params={"storeNumber":"${result.value}","storeOpenId":"7f10ceefa3069f41093344cb31da901f9e7ed5e11341dd1ac1bf22a8758e39e0","met":"ad61a7798da664f0822b4c3e3e783eed0124ed34400dcc8cabc31cd0212d1ebb","__page":"/pages/store-return-request/index"}`
    : ''
)

const aesEncryptText = () => {
  const message = formValues.value.message
  if (!message || typeof message !== 'string') return ''
  const key = enc.Base64.parse('aEsva0zDHECg47P8SuPzmw==')

  result.value = AES.encrypt(message, key, {
    mode: mode.ECB,
    padding: pad.Pkcs7
  }).ciphertext.toString()
}

const formConfigs: FormItem[] = [
  {
    label: 'Please input message',
    field: 'message',
    componentProps: {
      onChange: () => {
        aesEncryptText()
      }
    }
  }
]

const activeKey = ref(['configure-panel', 'response-panel'])

type FetchConfig = {
  key: string
  message: string
  [key: string]: string
}
const formValues: Ref<FetchConfig> = ref({
  key: '',
  message: ''
})

const storageKey = 'YAPI_INTERFACE_LIST_CONFIG'

watch(
  () => formValues.value,
  (values) => {
    window.localStorage.setItem(storageKey, JSON.stringify(values))
  },
  { deep: true }
)

const interfaceData = ref()

type Lists = Array<ApiItem & { [key: string]: string }>
const lists = computed<Lists>(() => interfaceData.value.data.list.map((item: any) => filterObjectByKey(item, ['title', 'method', 'path'])))

const apis = computed(() => generateApiFile(lists.value))

const downloadApis = async () => {
  downloadJavascript('apis', apis.value)
}
</script>
