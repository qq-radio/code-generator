<template>
  <a-drawer title="JSON预览" :visible="props.visible" :width="600" placement="right" @close="emits('update:visible', false)">
    <a-button style="margin-bottom: 20px" type="primary" @click="copy">Copy JSON</a-button>
    <VueJsonPretty :data="props.data" :deep="4" :show-length="true" :collapsedOnClickBrackets="true" :showIcon="true" />
  </a-drawer>
</template>

<script lang="ts" setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const emits = defineEmits(['update:visible'])

export interface Props {
  visible: boolean
  data: any
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  data: () => ({})
})

const copy = () => {
  navigator.clipboard.writeText(JSON.stringify(props.data))
}
</script>
