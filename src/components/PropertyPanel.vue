<template>
  <div class="lg:flex md:block"
       :class="{ 'fixed top-0 left-0 w-screen h-screen bg-white z-50 overflow-hidden py-6 px-12 !block': isFullScreen }">
    <div class="lg:w-1/3 md:11/12" :class="{ 'ml-0 w-2/3': isFullScreen }">
      <div class="mb-4">
        <a-button class="mr-4" type="primary" @click="toggleFullScreen">
          {{ isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen' }}
        </a-button>
        <a-checkbox v-if="propertyOptions?.length" @change="onAllCheckedChange">All Check</a-checkbox>
      </div>
      <a-checkbox-group v-model:value="checkedPropertyKeys">
        <template v-for=" option in propertyOptions" :key="option.value">
          <a-checkbox :value="option.value" @change="onCheckedChange">{{ option.label }}</a-checkbox>
        </template>
      </a-checkbox-group>
    </div>
    <div class="flex py-6 overflow-x-scroll lg:w-2/3 md:11/12 md:ml-0" :class="{ '!ml-0 !w-[99%]': isFullScreen }">
      <div>
        <div v-for="title in getDataSourceTitle" :key="title" class="element-row bg-slate-100">
          {{ capitalizeFirstLetter(title) }}:
        </div>
      </div>
      <Draggable :group="props.propertyType" :list="getDataSourceArray" itemKey="field" animation="340"
                 :style="{ display: 'flex' }" @update="onDragUpdate">
        <template #item="{ element }">
          <div>
            <div class="element-row" v-for="(column, columnIndex ) in element" :key="columnIndex">
              <a-textarea v-model:value="column.value" v-bind="column.componentProps" :rows="1" style="width: 100%" />
            </div>
          </div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropertyType, Properties, SettingConfigItem, DataSourceItem } from '@/types';
import { capitalizeFirstLetter } from '@/utils'
import Draggable from "vuedraggable";

const props = defineProps({
  propertyType: { type: String as () => PropertyType, required: true },
  settingConfig: { type: Object as () => SettingConfigItem[], required: true },
  properties: { type: Object as () => Properties },
});

const isFullScreen = ref<boolean>(false)

const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value;
}

type Option = {
  label: string;
  value: string;
}
const mapPropertiesToOptions = () => {
  if (!(props.properties instanceof Object)) {
    return
  }
  const options: Option[] = [];
  const keys = Object.keys(props.properties)
  keys.forEach(key => {
    options.push({
      label: props.properties![key].description,
      value: key,
    });
  })
  return options
}

const propertyOptions = computed<Option[] | undefined>(() => mapPropertiesToOptions())

const checkedPropertyKeys = ref<string[]>([])

const dataSourceMap = ref<Map<string, DataSourceItem[]>>(new Map())

const getDataSourceArray = computed<DataSourceItem[][]>(() => dataSourceMap.value?.size ? Array.from(dataSourceMap.value.values()) : []);

const getDataSourceTitle = computed<string[]>(() => getDataSourceArray.value[0]?.map(i => i.field) || []);

type CheckedEvent = {
  target: {
    value: string;
    checked: boolean;
  }
  [key: string]: any;
}
const onCheckedChange = (event: CheckedEvent) => {
  const { checked, value } = event.target
  if (checked) {
    const property: Record<string, any> = {
      key: value,
      ...props.properties![value]
    }
    const dataSourceItem = props.settingConfig.map(setting => ({
      ...setting,
      value: setting.defaultValueFromField && property[setting.defaultValueFromField]
    }))
    dataSourceMap.value.set(value, dataSourceItem)
  } else {
    dataSourceMap.value.delete(value)
  }
}

type AllCheckedEvent = {
  target: {
    checked: boolean;
  }
  [key: string]: any;
}
const onAllCheckedChange = (event: AllCheckedEvent) => {
  const { checked } = event.target
  if (checked) {
    checkedPropertyKeys.value = propertyOptions.value!.map(i => i.value)
    checkedPropertyKeys.value.forEach(key => {
      onCheckedChange({ target: { checked, value: key } })
    })
  } else {
    checkedPropertyKeys.value = []
    dataSourceMap.value.clear()
  }
}

type DragEvent = {
  oldIndex: number;
  newIndex: number;
  [key: string]: any;
}
const onDragUpdate = (event: DragEvent) => {
  const { oldIndex, newIndex } = event
  const array = Array.from(dataSourceMap.value);
  const oldItem = array[oldIndex]
  array.splice(oldIndex, 1,);
  array.splice(newIndex, 0, oldItem);
  dataSourceMap.value = new Map(array);
}

defineExpose({ getDataSourceArray })
</script>

<style lang='less' scoped>
.element-row {
  @apply border border-solid border-slate-300 h-12 w-44 overflow-hidden p-2;
}

/deep/ .ant-checkbox-wrapper {
  width: 48% !important;

  span {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90%;
  }
}
</style>
