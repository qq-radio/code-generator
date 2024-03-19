<template>
  <a-drawer title="JSON预览" :visible="props.visible" :width="600" placement="right" @close="emit('update:visible', false)">
    <VueJsonPretty :data="props.data" :deep="4" :show-length="true" :collapsedOnClickBrackets="true" :showIcon="true" />
  </a-drawer>
</template>

<script lang="ts" setup>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const emit = defineEmits(['update:visible'])

export interface Props {
  visible: boolean
  data: any
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  data: () => ({})
})
</script>
