<route lang="json">{
  "meta": {
    "sort": 3
  }
}</route>

<template>
  <div class="m-5 h-screen w-screen overflow-y-auto overflow-x-hidden p-2.5">
    <!-- input interface id -> fetch to perform interface name and path
         buttons: preview response json, preview mock json
         mock function: generate mock data by type
     -->
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
          <a-divider />
          <a-button class="mr-4 bg-green-500" type="primary" @click="previewJson('INTERFACE')">
            <template #icon>
              <EyeOutlined />
            </template>
            Preview Interface JSON
          </a-button>
          <a-button class="mr-4 bg-green-500" type="primary" @click="previewJson('RESPONSE')">
            <template #icon>
              <EyeOutlined />
            </template>
            Preview Response JSON
          </a-button>
          <a-button class="mr-4 bg-green-500" type="primary" @click="previewJson('MOCK')">
            <template #icon>
              <EyeOutlined />
            </template>
            Preview Mock JSON
          </a-button>
          <a-divider />
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <PreviewJsonModal v-model:visible="isPreviewJsonModalVisible" :data="previewJsonParams" />
</template>

<script lang="ts">
export default {
  name: 'MockGeneratorIndex'
}
</script>
<script setup lang="ts">
import { capitalizeFirstLetter, getValueByPath, checkNotEmptyKeyValue } from '@/utils'
import { codeConfigs } from '@/configs'
import type { Properties, FormItem } from '@/types'
import { yapiInterfaceGetApi } from '@/https/yapi'
import { EyeOutlined, RightOutlined } from '@ant-design/icons-vue'
import PreviewJsonModal from '@/components/PreviewJsonModal.vue'
import BasicFormItem from '@/components/FormItem.vue'

const formConfigs: FormItem[] = [
  {
    label: 'Please select interface token',
    field: 'projectToken',
    component: 'InterfaceTokenRadioGroup'
  },
  {
    label: 'Please input interface id',
    field: 'interfaceId'
  },
  {
    label: 'title',
    field: 'title',
    componentProps: {
      disabled: true
    }
  },
  {
    label: 'path',
    field: 'path',
    componentProps: {
      disabled: true
    }
  },

  {
    label: 'Please input response property keyPath',
    field: 'responsePropertyKeyPath'
  }
]

const activeKey = ref(['configure-panel', 'request-panel', 'response-panel'])

type FetchConfig = {
  projectToken: string
  interfaceId: string
  requestPropertyKeyPath: string
  responsePropertyKeyPath: string
}
const formValues: Ref<FetchConfig & { [key: string]: string }> = ref({
  projectToken: '',
  interfaceId: '',
  requestPropertyKeyPath: 'data.req_body_other.properties',
  responsePropertyKeyPath: 'data.req_body_other.properties'
})

const storageKey = 'MOCK_GENERATOR'

watch(
  () => formValues.value,
  (values) => {
    window.localStorage.setItem(storageKey, JSON.stringify(values))
  },
  { deep: true }
)

onMounted(() => {
  const values = window.localStorage.getItem(storageKey)
  if (values) {
    formValues.value = JSON.parse(values)
    fetchData()
  }
})

const interfaceData = ref()

const fetchData = async () => {
  const result = await yapiInterfaceGetApi(formValues.value)
  interfaceData.value = result
  formValues.value.title = result.data.title
  formValues.value.path = result.data.path
}

const generateMock = (
  data,
  options = {
    lengthOfArray: 4
  }
) => {
  const loop = (object) => {
    const mockData = {}

    for (const key in object) {
      if (key === 'code') {
        mockData[key] = 200
      } else if (key === 'message') {
        mockData[key] = 'from mock generator'
      } else if (key === 'current') {
        mockData[key] = 1
      } else if (key === 'total') {
        mockData[key] = 21
      } else if (key === 'size') {
        mockData[key] = 10
      } else {
        const field = object[key]
        switch (field.type) {
          case 'integer':
            mockData[key] = key + '__' + Math.floor(Math.random() * 1000)
            break
          case 'string':
            mockData[key] = key + '__' + Math.floor(Math.random() * 1000)
            break
          case 'boolean':
            mockData[key] = true
            break
          case 'array':
            mockData[key] = []
            for (let i = 0; i < options.lengthOfArray; i++) {
              const p = field.items.properties
              mockData[key].push(loop(p))
            }
            break
          case 'object':
            mockData[key] = {}
            const g = field.properties
            mockData[key] = loop(g)
            break
          case 'null':
            mockData[key] = null
            break
          default:
            mockData[key] = 'Unknown Type'
            // Handle other types if necessary
            break
        }
      }
    }

    return mockData
  }

  return loop(data)
}

const requestProperties = computed<Properties>(() => getValueByPath(interfaceData.value, formValues.value.requestPropertyKeyPath))
const responseProperties = computed<Properties>(() => getValueByPath(interfaceData.value, formValues.value.responsePropertyKeyPath))

/**
 * preview json
 */
type JsonType = 'INTERFACE' | 'REQUEST' | 'RESPONSE' | 'MOCK'
const isPreviewJsonModalVisible = ref(false)
const previewJsonParams = ref()

const previewJson = (jsonType: JsonType) => {
  switch (jsonType) {
    case 'INTERFACE':
      previewJsonParams.value = interfaceData.value
      break
    case 'REQUEST':
      previewJsonParams.value = requestProperties.value
      break
    case 'RESPONSE':
      previewJsonParams.value = responseProperties.value
      break
    case 'MOCK':
      previewJsonParams.value = generateMock(responseProperties.value)
      break
    default:
      break
  }
  isPreviewJsonModalVisible.value = true
}
</script>
