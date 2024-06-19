<route lang="json">
{
  "meta": {
    "sort": 4
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
          <div class="mb-2">
            注意现在的域名是：{{ DOMAIN }}
            <span class="text-xl font-semibold text-red-600"> {{ domain_name }}</span>
          </div>
          <a-button class="mr-4 bg-green-500" type="primary" @click="openPreviewJsonModal(true)" :disabled="isDisableAction">
            <template #icon>
              <EyeOutlined />
            </template>
            Preview Button Permissions Array
          </a-button>
          <a-button class="mr-4 bg-green-500" type="primary" @click="openPreviewJsonModal(false)" :disabled="isDisableAction">
            <template #icon>
              <EyeOutlined />
            </template>
            Preview Button Permissions
          </a-button>
          <a-popconfirm
            :title="`将按钮配置到【${formValues.parentName}】吗?请先【预览JSON】权限编码是否完全正确?`"
            ok-text="已确认正确"
            cancel-text="No"
            :disabled="isDisableAction"
            @confirm="SendPostPermissionRequest"
          >
            <a-button class="mr-4" type="primary" :disabled="isDisableAction">
              <template #icon>
                <RightOutlined />
              </template>
              Send Request
            </a-button>
          </a-popconfirm>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="response-panel" header="Request panel">wait</a-collapse-panel>
    </a-collapse>
    <PreviewJsonModal v-model:visible="isPreviewJsonModalVisible" :data="previewJsonParams" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'SchemaGeneratorIndex'
}
</script>
<script setup lang="ts">
import { checkNotEmptyKeyValue } from '@/utils'
import type { FormItem } from '@/types'
import { adminInterfaceGetApi, adminInterfacePostApi, adminServerTestInterfaceGetApi, adminServerTestInterfacePostApi } from '@/https/admin'
import { EyeOutlined, RightOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import PreviewJsonModal from '@/components/PreviewJsonModal.vue'
import BasicFormItem from '@/components/FormItem.vue'

const DOMAIN = import.meta.env.VITE_ADMIN_DEV_BASE_URL
const domain_name = /dev/.test(DOMAIN) ? '开发' : '测试'

const codeOptions = [
  {
    label: '新增',
    value: 'ADD'
  },
  {
    label: '编辑',
    value: 'EDIT'
  },
  {
    label: '查看',
    value: 'VIEW'
  },
  {
    label: '启用/禁用',
    value: 'STATUS'
  },
  {
    label: '删除',
    value: 'DELETE'
  },
  {
    label: '导入',
    value: 'IMPORT'
  },
  {
    label: '导出',
    value: 'EXPORT'
  },
  {
    label: '明细导出',
    value: 'DETAIL_EXPORT'
  },
  {
    label: '追加额度',
    value: 'ADDITIONAL_MONEY'
  },
  {
    label: '充值',
    value: 'TOPUP'
  },
  {
    label: '充值记录',
    value: 'TOPUP_RECORD'
  },
  {
    label: '已发工资',
    value: 'PAID_SALARY'
  },
  {
    label: '下发工资',
    value: 'SEND_SALARY'
  },
  {
    label: '奖励明细',
    value: 'REWARD_DETAIL'
  }
]

const formConfigs: FormItem[] = [
  {
    label: 'Please Select Env',
    field: 'env',
    component: 'a-radio-group',
    componentProps: {
      options: [
        {
          label: '开发环境',
          value: 'DEV'
        },
        {
          label: '测试环境',
          value: 'TEST'
        }
      ]
    }
  },
  {
    label: 'Please input button parentId',
    field: 'parentId',
    componentProps: {
      onChange: () => {
        setTimeout(() => {
          setParentNameAndCode()
        }, 1000)
      }
    }
  },
  {
    label: 'Parent name by id is',
    field: 'parentName',
    componentProps: {
      disabled: true
    }
  },
  {
    label: 'Parent code by id is',
    field: 'parentCode',
    componentProps: {
      disabled: true
    }
  },
  {
    label: 'Please Select the case type you want to use',
    field: 'caseType',
    component: 'a-radio-group',
    componentProps: {
      options: [
        {
          label: '小写',
          value: 'LOWER'
        },
        {
          label: '大写',
          value: 'UPPER'
        }
      ]
    }
  },
  {
    label: 'Please select button button codes',
    field: 'codes',
    component: 'a-checkbox-group',
    componentProps: {
      options: codeOptions
    }
  }
]

const activeKey = ref(['configure-panel', 'response-panel'])

type FetchConfig = {
  env: string
  parentId: string
  parentCode: string
  parentName: string
  codes: string[]
  [key: string]: string | string[]
}
const formValues: Ref<FetchConfig> = ref({
  env: 'DEV',
  parentId: '',
  parentCode: '',
  parentName: '',
  caseType: 'LOWER',
  codes: ['ADD', 'VIEW', 'EXPORT']
})

const permissionDetailApi = computed(() => (formValues.value.env === 'DEV' ? adminInterfaceGetApi : adminServerTestInterfaceGetApi))

const buttonPermissionPostApi = computed(() => (formValues.value.env === 'DEV' ? adminInterfacePostApi : adminServerTestInterfacePostApi))

const defaultParams = {
  menuType: 0,
  sort: 1,
  invisible: false,
  belongSystem: ['code'],
  businessSystemId: '8'
}

const concatButtonCode = (buttonCode: string) => {
  const { parentCode, caseType } = formValues.value
  const casedButtonCode = caseType === 'UPPER' ? buttonCode.toUpperCase() : buttonCode.toLowerCase()
  return parentCode.concat('.', casedButtonCode)
}

const buttonPermissionArray = computed(() => {
  const { parentId, codes } = formValues.value
  return codeOptions
    .filter((option) => codes.includes(option.value))
    .map((option) => ({ ...defaultParams, parentId, name: option.label, code: concatButtonCode(option.value) }))
})

const buttonPermissions = computed(() => {
  const { codes } = formValues.value
  return Object.fromEntries(codes.map((code) => [code, concatButtonCode(code)]))
})

const isDisableAction = computed(() => {
  return !checkNotEmptyKeyValue(formValues.value)
})

const request = async (params: any) => {
  const result = await buttonPermissionPostApi.value(params)
  return result
}

const setParentNameAndCode = async () => {
  const { code, name } = await permissionDetailApi.value(formValues.value.parentId)
  formValues.value.parentCode = code
  formValues.value.parentName = name
}

const SendPostPermissionRequest = async () => {
  const isValid = checkNotEmptyKeyValue(formValues.value)
  if (!isValid) {
    message.warning('Please complete configure panel')
    return
  }

  const tasks = buttonPermissionArray.value.map((permission) => request(permission))
  Promise.all(tasks)
}

const isPreviewJsonModalVisible = ref(false)
const previewJsonParams = ref()
const openPreviewJsonModal = (isPreviewArray: boolean) => {
  previewJsonParams.value = isPreviewArray ? buttonPermissionArray.value : buttonPermissions.value
  isPreviewJsonModalVisible.value = true
}
</script>
