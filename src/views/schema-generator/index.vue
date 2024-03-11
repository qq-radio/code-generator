<template>
  <div class="m-5">
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel key="configure-panel" header="Configure panel">
        <a-form labelAlign="left" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }">
          <a-form-item v-for="(formItem, index) in formConfigs" :key="index" :label="formItem.label">
            <template v-if="formItem.component === 'a-radio-group'">
              <a-radio-group v-model:value="formValues[formItem.field]" v-bind="formItem.componentProps" />
            </template>

            <template v-else>
              <a-input v-model:value="formValues[formItem.field]" v-bind="formItem.componentProps" />
            </template>
          </a-form-item>
        </a-form>
        <div>
          <a-button type="primary" @click="fetchData">

            <template #icon>
              <RightOutlined />
            </template>
            Send Request
          </a-button>
          <a-button type="primary" @click="openPreviewJsonModal">

            <template #icon>
              <EyeOutlined />
            </template>
            Preview JSON
          </a-button>
          <a-button type="primary" @click="downloadInterfaceData">

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
        <PropertyPanel ref="requestPanelRef" propertyType='REQUEST' :settingConfig="codeConfig.requestSettingConfig"
                       :properties="requestProperties" />
      </a-collapse-panel>
      <a-collapse-panel v-if="codeConfig?.responseSettingConfig" key="response-panel" header="Response panel">
        <PropertyPanel ref="responsePanelRef" propertyType='RESPONSE' :settingConfig="codeConfig.responseSettingConfig"
                       :properties="responseProperties" />
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
import { codeConfigs } from '@/configs';
import type { CodeType, Properties, DataSourceItem } from '@/types';
import { axiosFetch } from '@/https'
import { DownloadOutlined, EyeOutlined, RightOutlined } from '@ant-design/icons-vue';
import PreviewJsonModal from '@/components/PreviewJsonModal.vue';
import PropertyPanel from '@/components/PropertyPanel.vue';
import { message } from 'ant-design-vue';

const getCodeConfig = (codeType: CodeType) => codeConfigs.find(i => i.codeType === codeType)

const formConfigs = [
  {
    label: 'Please input yapi domain',
    field: 'yapiDomain',
    componentProps: {
      disabled: true,
    }
  },
  {
    label: 'Please input project token',
    field: 'projectToken',
  },
  {
    label: 'Please input interface id',
    field: 'interfaceId',
  },
  {
    label: 'Please input request property keyPath',
    field: 'requestPropertyKeyPath',
  },
  {
    label: 'Please input response property keyPath',
    field: 'responsePropertyKeyPath',
  },
  {
    label: 'Please choose code type',
    field: 'codeType',
    component: 'a-radio-group',
    componentProps: {
      options: codeConfigs.sort((a, b) => a.sort - b.sort).map(config => ({ label: capitalizeFirstLetter(config.codeType), value: config.codeType })),
      onChange: (event: any) => {
        cleanData()
        fetchData()
      },
    },
  },
]

const activeKey = ref(['configure-panel', 'request-panel', 'response-panel'])

type FetchConfig = {
  codeType: CodeType
  yapiDomain: string
  projectToken: string
  interfaceId: string
  requestPropertyKeyPath: string
  responsePropertyKeyPath: string
}
const formValues: Ref<FetchConfig & { [key: string]: string }> = ref({
  codeType: 'TABLE',
  yapiDomain: 'yapiDomain',
  projectToken: '',
  interfaceId: '',
  requestPropertyKeyPath: 'data.req_body_other.properties',
  responsePropertyKeyPath: 'data.res_body.properties.data.properties.records.items.properties',
})

const storageKey = 'fetch-config'

watch(
  () => formValues.value,
  (values) => {
    window.localStorage.setItem(storageKey, JSON.stringify(values))
  },
  { deep: true }
)

onMounted(() => {
  const values = JSON.parse(window.localStorage.getItem(storageKey) || '')
  formValues.value = values
  fetchData()
})

const interfaceData = ref()

const fetchData = async () => {
  const isValid = checkNotEmptyKeyValue(formValues.value)
  if (!isValid) {
    message.warning('Please complete request fetch configure');
    return
  }
  interfaceData.value = await axiosFetch(formValues.value)
}

const cleanData = async () => {
  interfaceData.value = {}
}

const codeConfig = computed(() => getCodeConfig(formValues.value.codeType))
const requestProperties = computed<Properties>(() => getValueByPath(interfaceData.value, formValues.value.requestPropertyKeyPath))
const responseProperties = computed<Properties>(() => getValueByPath(interfaceData.value, formValues.value.responsePropertyKeyPath))

const requestPanelRef = ref()
const responsePanelRef = ref()

const getDataSourceValues = (array: DataSourceItem[]) => {
  const object: Record<string, any> = {}
  array.forEach(i => object[i.field] = i.value)
  return object
}

const requestDataSource = computed(() => requestPanelRef.value.getDataSourceArray.map(getDataSourceValues))
const responseDataSource = computed(() => {
  return responsePanelRef.value.getDataSourceArray.map(getDataSourceValues)
})

const getTableSchemas = () => {
  const columns = [...responseDataSource.value];
  for (const item of requestDataSource.value) {
    const columnIndex = columns.findIndex(i => i.dataIndex === item.field)
    if (columnIndex !== -1) {
      const columnItem = {
        ...columns[columnIndex],
        searchConfig: { ...item },
      }
      columns.splice(columnIndex, 1, columnItem)
    } else {
      const columnItem = {
        ifShow: false,
        searchConfig: { ...item },
      }
      columns.push(columnItem)
    }
  }
  return columns
}

const getFormSchemas = () => {
  return requestDataSource.value
}

const getDescriptionSchemas = () => {
  return responseDataSource.value
}

const getSchemas = () => {
  let schemas = []
  switch (formValues.value.codeType) {
    case 'TABLE':
      schemas = getTableSchemas()
      break;
    case 'FORM':
      schemas = getFormSchemas()
      break;
    case 'DESCRIPTION':
      schemas = getDescriptionSchemas()
      break;
    default:
      break;
  }
  return schemas
}


/**
 * preview json
 */
const isPreviewJsonModalVisible = ref(false);
const previewJsonParams = ref();
const openPreviewJsonModal = () => {
  previewJsonParams.value = getSchemas()
  isPreviewJsonModalVisible.value = true;
}


/**
 * download json
 */
const downloadFileName = {
  interface: 'interfaceData',
  schema: 'schema'
}

const downloadInterfaceData = async () => {
  downloadJson(interfaceData.value, downloadFileName.interface)
}

const downloadSchemas = async () => {
  downloadJson(getSchemas(), downloadFileName.schema)
}
</script>

<style lang='less' scoped>
.ant-btn {
  margin-right: 20px;
}

/deep/ .ant-collapse-header-text {
  font-weight: 600;
}
</style>
