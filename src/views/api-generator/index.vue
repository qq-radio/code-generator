<template>
  <div class="m-5 h-screen w-screen overflow-y-auto overflow-x-hidden p-2.5">
    <a-collapse v-model:activeKey="activeKey" class="w-11/12">
      <a-collapse-panel key="configure-panel" header="Configure panel">
        <a-form labelAlign="left" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }">
          <a-form-item v-for="(formItem, index) in formConfigs" :key="index" :label="formItem.label">
            <a-input v-model:value="formValues[formItem.field]" v-bind="formItem.componentProps" />
          </a-form-item>
        </a-form>
        <div>
          <a-button class="mr-4" type="primary" @click="fetchData">
            <template #icon>
              <RightOutlined />
            </template>
            Send Request
          </a-button>
          <a-button class="mr-4" type="primary" @click="downloadInterfaceData">
            <template #icon>
              <DownloadOutlined />
            </template>
            Download Interface Data
          </a-button>
          <a-button type="primary" @click="downloadApis">
            <template #icon>
              <DownloadOutlined />
            </template>
            Download Apis
          </a-button>
        </div>
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
import { downloadJson, downloadJavascript } from '@/utils/download'
import { checkNotEmptyKeyValue, filterObjectByKey } from '@/utils'
import type { FormItem, ApiItem } from '@/types'
import { yapiInterfaceListApi } from '@/https/yapi'
import { DownloadOutlined, RightOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const formConfigs: FormItem[] = [
  {
    label: 'Please input project token',
    field: 'projectToken'
  },
  {
    label: 'Please input cat id',
    field: 'catId'
  }
]

const activeKey = ref(['configure-panel', 'response-panel'])

type FetchConfig = {
  projectToken: string
  catId: string
  [key: string]: string
}
const formValues: Ref<FetchConfig> = ref({
  projectToken: '',
  catId: ''
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

const fetchData = async () => {
  const isValid = checkNotEmptyKeyValue(formValues.value)
  if (!isValid) {
    message.warning('Please complete request fetch configure')
    return
  }
  interfaceData.value = await yapiInterfaceListApi(formValues.value)
}

onMounted(() => {
  const values = window.localStorage.getItem(storageKey)
  if (values) {
    formValues.value = JSON.parse(values)
    fetchData()
  }
})

type Lists = Array<ApiItem & { [key: string]: string }>
const lists = computed<Lists>(() => interfaceData.value.data.list.map((item: any) => filterObjectByKey(item, ['title', 'method', 'path'])))

const apis = computed(() => generateApiFile(lists.value))

const downloadInterfaceData = async () => {
  downloadJson('interface-data', interfaceData.value)
}

const downloadApis = async () => {
  downloadJavascript('apis', apis.value)
}
</script>
