<route lang="json">
{
  "meta": {
    "sort": 2
  }
}
</route>

<template>
  <div class="m-5 h-screen w-screen overflow-y-auto overflow-x-hidden p-2.5">
    <a-collapse v-model:activeKey="activeKey" class="w-11/12">
      <a-collapse-panel key="configure-panel" header="Configure panel">
        <a-form labelAlign="left" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }">
          <a-form-item v-for="(formItem, index) in formConfigs" :key="index" :label="formItem.label">
            <BasicFormItem v-model="formValues[formItem.field]" :formItem="formItem" />
          </a-form-item>
        </a-form>
        <div>
          <a-button class="mr-4" type="primary" @click="fetchData">
            <template #icon>
              <RightOutlined />
            </template>
            Send Request
          </a-button>
          <a-button class="bg-green-500" type="primary" @click="previewJavaScript">
            <template #icon>
              <EyeOutlined />
            </template>
            Preview JavaScript
          </a-button>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="response-panel" header="Request panel">wait</a-collapse-panel>
    </a-collapse>
    <PreviewJavaScriptModal v-model:visible="isModalVisible" :data="code" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'SchemaGeneratorIndex'
}
</script>
<script setup lang="ts">
import { generateApiFile, generateApiFileNew } from '@/utils/generate'
import { downloadJavascript } from '@/utils/download'
import { checkNotEmptyKeyValue, filterObjectByKey } from '@/utils'
import type { FormItem, ApiItem } from '@/types'
import { yapiInterfaceListApi } from '@/https/yapi'
import { EyeOutlined, RightOutlined } from '@ant-design/icons-vue'
import PreviewJavaScriptModal from '@/components/PreviewJavaScriptModal.vue'
import BasicFormItem from '@/components/FormItem.vue'
import { message } from 'ant-design-vue'

const formConfigs: FormItem[] = [
  {
    label: 'Please select interface token',
    field: 'projectToken',
    component: 'InterfaceTokenRadioGroup'
  },
  {
    label: 'Please input cat id',
    field: 'catId'
  },
  {
    label: 'Do you want to naming your service name',
    field: 'serviceName'
  },
  {
    label: 'Please input service url',
    field: 'serviceUrl'
  },
  {
    label: 'Number of word',
    field: 'wordNumber'
  },
  {
    label: 'Old version or New version',
    field: 'isNew',
    component: 'a-radio-group',
    componentProps: {
      options: [
        {
          label: 'Old',
          value: 0
        },
        {
          label: 'New',
          value: 1
        }
      ]
    }
  }
]

const activeKey = ref(['configure-panel', 'response-panel'])

type FetchConfig = {
  projectToken: string
  catId: string
  serviceName: string
  [key: string]: string
}
const formValues: Ref<FetchConfig> = ref({
  projectToken: '',
  catId: '',
  serviceName: 'todoService',
  serviceUrl: 'todoService',
  wordNumber: 'todoService'
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
  // if (!isValid) {
  //   message.warning('Please complete request fetch configure')
  //   return
  // }
  interfaceData.value = await yapiInterfaceListApi(formValues.value)
  formValues.value.serviceUrl = undefined
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

// 以前用generateApiFile，现在用generateApiFileNew
const apis = computed(() =>
  generateApiFileNew(lists.value, {
    serviceName: 'axios',
    serviceUrl: formValues.value.serviceUrl,
    wordNumber: formValues.value.wordNumber
  })
)

const downloadApis = () => {
  downloadJavascript('apis', apis.value)
}

// 这种情况可能为空，要兼容
//  export const /pieceSalaryMonthlySummary/Api = data => axios.post(`${BASE_SERVICE_URL}/`,  data)

const isModalVisible = ref(false)
const code = ref()

const previewJavaScript = async () => {
  if (!formValues.value.serviceUrl) {
    alert('serviceUrl不能为空')
    return
  }
  code.value = generateApiFileNew(lists.value, {
    serviceName: 'axios',
    serviceUrl: formValues.value.serviceUrl,
    wordNumber: Number(formValues.value.wordNumber)
  })
  isModalVisible.value = true
}
</script>
