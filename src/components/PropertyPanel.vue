<template>
  <div class="md:block lg:flex" :class="{ 'fixed left-0 top-0 z-50 !block h-screen w-screen overflow-hidden bg-white px-12 py-6': isFullScreen }">
    <div class="md:11/12 lg:w-1/3" :class="{ 'ml-0 w-2/3': isFullScreen }">
      <div class="mb-4">
        <a-button class="mr-4" type="primary" @click="toggleFullScreen">
          {{ isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
        </a-button>
        <a-checkbox v-if="propertyOptions?.length" @change="onAllCheckedChange">All Check</a-checkbox>
      </div>
      <a-checkbox-group v-model:value="checkedPropertyKeys">
        <template v-for="option in propertyOptions" :key="option.value">
          <a-checkbox :value="option.value" @change="onCheckedChange">{{ option.label }}</a-checkbox>
        </template>
      </a-checkbox-group>
    </div>
    <div class="md:11/12 flex overflow-x-scroll py-6 md:ml-0 lg:w-2/3" :class="{ '!ml-0 !w-[99%]': isFullScreen }">
      <div>
        <div v-for="title in getDataSourceTitle" :key="title" class="element-row bg-slate-100">{{ capitalizeFirstLetter(title) }}:</div>
      </div>
      <Draggable :group="props.propertyType" :list="getDataSourceArray" itemKey="field" animation="340" :style="{ display: 'flex' }" @update="onDragUpdate">
        <template #item="{ element }">
          <div>
            <div class="element-row" v-for="(column, columnIndex) in element" :key="columnIndex">
              <template v-if="column.component === 'Input'">
                <a-textarea v-model:value="column.value" v-bind="column.componentProps" :rows="1" style="width: 100%" />
              </template>
              <template v-if="column.component === 'Select'">
                <a-select v-model:value="column.value" v-bind="column.componentProps" style="width: 100%" />
              </template>
              <template v-if="column.component === 'Checkbox'">
                <a-checkbox v-model:checked="column.value">必填</a-checkbox>
              </template>
            </div>
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropertyType, Properties, SettingConfigItem, DataSourceItem } from '@/types'
import { capitalizeFirstLetter } from '@/utils'
import Draggable from 'vuedraggable'

const props = defineProps({
  propertyType: { type: String as () => PropertyType, required: true },
  settingConfig: { type: Object as () => SettingConfigItem[], required: true },
  properties: { type: Object as () => Properties },
  reqQuery: {
    type: Array<{
      name: string
      desc: string
    }>
  }
})

const isFullScreen = ref<boolean>(false)

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
}

type Option = {
  label: string
  value: string
}
const mapPropertiesToOptions = () => {
  // 兼容新的写法
  if (props.reqQuery?.length) {
    return props.reqQuery.map((query) => {
      return {
        label: query.desc,
        value: query.name
      }
    })
  }

  if (!(props.properties instanceof Object)) {
    return
  }
  const options: Option[] = []
  const keys = Object.keys(props.properties)
  keys.forEach((key) => {
    options.push({
      label: props.properties![key].description,
      value: key
    })
  })
  return options
}

const propertyOptions = computed<Option[] | undefined>(() => mapPropertiesToOptions())

const checkedPropertyKeys = ref<string[]>([])

const dataSourceMap = ref<Map<string, DataSourceItem[]>>(new Map())

const getDataSourceArray = computed<DataSourceItem[][]>(() => (dataSourceMap.value?.size ? Array.from(dataSourceMap.value.values()) : []))

const getDataSourceTitle = computed<string[]>(() => getDataSourceArray.value[0]?.map((i) => i.field) || [])

const storageKey = `data-source-${props.propertyType}`

watch(
  () => dataSourceMap.value,
  (values) => {
    window.localStorage.setItem(storageKey, JSON.stringify(Array.from(values.entries())))
  },
  { deep: true }
)

onMounted(() => {
  const storedData = window.localStorage.getItem(storageKey)
  if (storedData) {
    const values = JSON.parse(storedData)
    dataSourceMap.value = new Map(values)
    checkedPropertyKeys.value = Array.from(dataSourceMap.value.keys())
  }
})

type CheckedEvent = {
  target: {
    value: string
    checked: boolean
  }
  [key: string]: any
}
const onCheckedChange = (event: CheckedEvent) => {
  const { checked, value } = event.target
  if (checked) {
    const property: Record<string, any> = {
      key: value,
      ...props.properties![value]
    }
    const dataSourceItem = props.settingConfig.map((setting) => ({
      ...setting,
      value: setting.component === 'Select' ? 'Input' : setting.defaultValueFromField && property[setting.defaultValueFromField]
    }))
    dataSourceMap.value.set(value, dataSourceItem)
  } else {
    dataSourceMap.value.delete(value)
  }
}

type AllCheckedEvent = {
  target: {
    checked: boolean
  }
  [key: string]: any
}
const onAllCheckedChange = (event: AllCheckedEvent) => {
  const { checked } = event.target
  if (checked) {
    checkedPropertyKeys.value = propertyOptions.value!.map((i) => i.value)
    checkedPropertyKeys.value.forEach((key) => {
      onCheckedChange({ target: { checked, value: key } })
    })
  } else {
    checkedPropertyKeys.value = []
    dataSourceMap.value.clear()
  }
}

type DragEvent = {
  oldIndex: number
  newIndex: number
  [key: string]: any
}
const onDragUpdate = (event: DragEvent) => {
  const { oldIndex, newIndex } = event
  const array = Array.from(dataSourceMap.value)
  const oldItem = array[oldIndex]
  array.splice(oldIndex, 1)
  array.splice(newIndex, 0, oldItem)
  dataSourceMap.value = new Map(array)
}

defineExpose({ getDataSourceArray })
</script>

<style lang="less" scoped>
.element-row {
  @apply h-12 w-44 overflow-hidden border border-solid border-slate-300 p-2;
}

/deep/ .ant-checkbox-wrapper {
  width: 48% !important;

  span {
    display: inline-block;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
