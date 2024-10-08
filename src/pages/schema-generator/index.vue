<route lang="json">
{
  "meta": {
    "sort": 1
  }
}
</route>

<template>
  <div class="m-5 h-screen w-screen overflow-y-auto overflow-x-hidden p-2.5">
    <a-collapse v-model:activeKey="activeKey" class="w-11/12">
      <a-collapse-panel key="configure-panel" header="Configure panel">
        <a-form labelAlign="left" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }">
          <a-form-item v-for="(formItem, index) in formConfigs" :key="index" :label="formItem.label">
            <FormItem v-model="formValues[formItem.field]" :formItem="formItem" />
          </a-form-item>
        </a-form>
        <div>
          <a-button class="mr-4" type="primary" @click="sendRequest">
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
          <a-button class="mr-4 bg-green-500" type="primary" @click="previewJson('REQUEST')">
            <template #icon>
              <EyeOutlined />
            </template>
            Preview Request JSON
          </a-button>
          <a-button class="mr-4 bg-green-500" type="primary" @click="previewJson('RESPONSE')">
            <template #icon>
              <EyeOutlined />
            </template>
            Preview Response JSON
          </a-button>
          <a-button class="mr-4 bg-green-500" type="primary" @click="previewJson('SCHEMA')">
            <template #icon>
              <EyeOutlined />
            </template>
            Preview Schema JSON
          </a-button>
          <a-divider />
          <a-button class="mr-4" type="primary" @click="downloadInterfaceData">
            <template #icon>
              <DownloadOutlined />
            </template>
            Download Interface Data
          </a-button>
          <a-button type="primary" @click="downloadSchemas">
            <template #icon>
              <DownloadOutlined />
            </template>
            Download Schemas
          </a-button>
        </div>
      </a-collapse-panel>
      <a-collapse-panel v-if="codeConfig?.requestSettingConfig" key="request-panel" header="Request panel">
        <PropertyPanel
          ref="requestPanelRef"
          propertyType="REQUEST"
          :settingConfig="codeConfig.requestSettingConfig"
          :properties="isFormReqQuery ? reqQueryProperties : requestProperties"
        />
      </a-collapse-panel>
      <a-collapse-panel v-if="codeConfig?.responseSettingConfig" key="response-panel" header="Response panel">
        <a-checkbox class="mb-2" v-model:checked="isAddActionField">Add Action Field</a-checkbox>
        <PropertyPanel
          ref="responsePanelRef"
          propertyType="RESPONSE"
          :settingConfig="codeConfig.responseSettingConfig"
          :properties="responseProperties"
        />
      </a-collapse-panel>
    </a-collapse>
  </div>
  <PreviewJsonModal v-model:visible="isPreviewJsonModalVisible" :data="previewJsonParams" />
</template>

<script lang="ts">
export default {
  name: 'SchemaGeneratorIndex'
}
</script>
<script setup lang="ts">
import { downloadJson } from '@/utils/download'
import { capitalizeFirstLetter, getValueByPath, checkNotEmptyKeyValue } from '@/utils'
import { codeConfigs } from '@/configs'
import type { Framework, CodeType, Properties, DataSourceItem, FormItem, TableSchemaItem, SchemaItem } from '@/types'
import {
  formatAntdTableSchemas,
  formatAntdFormSchemas,
  formatEplusFormSchemas,
  formatEPlusTableSchemas
} from './_/format-schema'
import { yapiInterfaceGetApi } from '@/https/yapi'
import { DownloadOutlined, EyeOutlined, RightOutlined } from '@ant-design/icons-vue'
import { Descriptions, message } from 'ant-design-vue'

const getCodeConfig = (codeType: CodeType) => codeConfigs.find((i) => i.codeType === codeType)

const formConfigs: FormItem[] = [
  {
    label: 'Please select framework you use',
    field: 'framework',
    component: 'a-radio-group',
    componentProps: {
      options: [
        {
          label: 'Vben',
          value: 'VBEN'
        },
        {
          label: 'Antd Admin',
          value: 'ANTD'
        },
        {
          label: 'EPlus',
          value: 'EPLUS'
        }
      ]
    }
  },
  {
    label: 'Please choose code type',
    field: 'codeType',
    component: 'a-radio-group',
    componentProps: {
      options: codeConfigs
        .sort((a, b) => a.sort - b.sort)
        .map((config) => ({ label: capitalizeFirstLetter(config.codeType), value: config.codeType })),
      // 之前是onChange然后一直报function array的错 我不知道为什么 但是我也暂时用不到 所以先换成change？ 不过这样是不是就没效果了？
      change: (event: any) => {
        cleanData()
        fetchData()
      }
    }
  },
  {
    label: 'Please input project token',
    field: 'projectToken',
    component: 'InterfaceTokenRadioGroup'
  },
  {
    label: 'Please input interface id',
    field: 'interfaceId'
  },
  {
    label: 'Please input request property keyPath',
    field: 'requestPropertyKeyPath'
  },
  {
    label: 'Please input response property keyPath',
    field: 'responsePropertyKeyPath'
  }
]

const activeKey = ref(['configure-panel', 'request-panel', 'response-panel'])

type FetchConfig = {
  framework: Framework
  codeType: CodeType
  projectToken: string
  interfaceId: string
  requestPropertyKeyPath: string
  responsePropertyKeyPath: string
}
const formValues: Ref<FetchConfig & { [key: string]: string }> = ref({
  framework: 'EPLUS',
  codeType: 'TABLE',
  projectToken: '',
  interfaceId: '',
  requestPropertyKeyPath: 'data.req_body_other.properties',
  // requestPropertyKeyPath: 'data.req_query',
  responsePropertyKeyPath: 'data.res_body.properties.data.properties.records.items.properties'
})

const storageKey = 'YAPI_INTERFACE_GET_CONFIG'

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
  const isValid = checkNotEmptyKeyValue(formValues.value)
  if (!isValid) {
    message.warning('Please complete request fetch configure')
    return
  }
  interfaceData.value = await yapiInterfaceGetApi(formValues.value)
}

const codeConfig = computed(() => getCodeConfig(formValues.value.codeType))
const requestProperties = computed<Properties>(() =>
  getValueByPath(interfaceData.value, formValues.value.requestPropertyKeyPath)
)
const reqQuery = computed<
  Array<{
    name: string
    desc: string
  }>
>(() => getValueByPath(interfaceData.value, 'data.req_query'))
// 兼容新写法，从req_query来
const isFormReqQuery = computed(() => formValues.value.requestPropertyKeyPath === 'data.req_query')
const reqQueryProperties = computed(() => {
  const obj = {}
  reqQuery.value?.forEach((item) => {
    obj[item.name] = {
      type: '',
      description: item.desc
    }
  })
  return obj
})
const responseProperties = computed<Properties>(() =>
  getValueByPath(interfaceData.value, formValues.value.responsePropertyKeyPath)
)

const requestPanelRef = ref()
const responsePanelRef = ref()

const cleanData = () => {
  requestPanelRef.value?.cleanData()
  responsePanelRef.value?.cleanData()
}

const sendRequest = async () => {
  cleanData()
  fetchData()
}

const getDataSourceValues = (array: DataSourceItem[]) => {
  const object: Record<string, any> = {}
  array.forEach((i) => (object[i.field] = i.value))
  return object
}

const getSettingProperty = (schema: DataSourceItem) => {
  if (schema.component !== 'Input') {
    const property = codeConfig.value?.requestSettingConfig
      ?.find((i) => i?.component === 'Select')
      ?.componentProps?.options?.find((j: any) => j.value === schema.component)?.property
    return property ? { ...schema, componentProps: property } : schema
  }
  return schema
}

const requestDataSource = computed(() => {
  let requestSchema = requestPanelRef.value.getDataSourceArray.map(getDataSourceValues)
  requestSchema = requestSchema.map(getSettingProperty)
  return requestSchema
})

const responseDataSource = computed(() => responsePanelRef.value.getDataSourceArray.map(getDataSourceValues))

const isAddActionField = ref(false)

const formatTableSchemas = (columns: TableSchemaItem[]) => {
  if (formValues.value.framework === 'ANTD') {
    const columnsvalue = formatAntdTableSchemas(columns)
    if (isAddActionField.value) {
      columnsvalue.push({
        title: '操作',
        dataIndex: 'actions',
        scopedSlots: { customRender: 'actions' },
        fixed: 'right',
        width: 120
      })
    }
    return columnsvalue
  }
  if (formValues.value.framework === 'EPLUS') {
    const columnsvalue = formatEPlusTableSchemas(columns)
    if (isAddActionField.value) {
      columnsvalue.push({
        label: '操作',
        prop: 'actions',
        scopedSlots: { customRender: 'actions' },
        fixed: 'right',
        width: 120
      })
    }
    return columnsvalue
  }
  return columns
}

const getTableSchemas = () => {
  const invisibleSchemas = []
  const columns = [...responseDataSource.value]
  for (const item of requestDataSource.value) {
    const columnIndex = columns.findIndex((i) => i.dataIndex === item.field)
    if (columnIndex !== -1) {
      const columnItem = {
        ...columns[columnIndex],
        searchConfig: { ...item }
      }
      columns.splice(columnIndex, 1, columnItem)
    } else {
      const columnItem = {
        ifShow: false,
        searchConfig: { ...item }
      }
      invisibleSchemas.push(columnItem)
    }
  }

  return formatTableSchemas(invisibleSchemas.concat(columns))
}

const formatFormSchemas = (columns: SchemaItem[]) => {
  if (formValues.value.framework === 'ANTD') {
    return formatAntdFormSchemas(columns)
  }
  if (formValues.value.framework === 'EPLUS') {
    return formatEplusFormSchemas(columns)
  }
  return columns
}

const getFormSchemas = () => {
  return formatFormSchemas(requestDataSource.value)
}

const getDescriptionSchemas = () => {
  return responseDataSource.value
}

const getSchemas = () => {
  let schemas = []
  switch (formValues.value.codeType) {
    case 'TABLE':
      schemas = getTableSchemas()
      break
    case 'FORM':
      schemas = getFormSchemas()
      break
    case 'DESCRIPTION':
      schemas = getDescriptionSchemas()
      break
    default:
      break
  }
  return schemas
}

/**
 * preview json
 */
type JsonType = 'INTERFACE' | 'REQUEST' | 'RESPONSE' | 'SCHEMA'
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
    case 'SCHEMA':
      previewJsonParams.value = getSchemas()
      break
    default:
      break
  }
  isPreviewJsonModalVisible.value = true
}

/**
 * download json
 */
const downloadInterfaceData = async () => {
  downloadJson('interface-data', interfaceData.value)
}

const downloadSchemas = async () => {
  downloadJson('schema', getSchemas())
}
</script>
