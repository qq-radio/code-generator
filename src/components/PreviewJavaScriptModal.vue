<template>
  <a-drawer title="JSON预览" :visible="visible" width="60%" placement="right" @close="emits('update:visible', false)">
    <a-button style="margin-bottom: 20px" type="primary" @click="copy">Copy Code</a-button>
    <hljsVuePlugin.component language="js" :code="data" />
  </a-drawer>
</template>

<script lang="ts" setup>
import 'highlight.js/styles/stackoverflow-light.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import javascript from 'highlight.js/lib/languages/javascript'
import hljs from 'highlight.js/lib/core'

hljs.registerLanguage('javascript', javascript)

export interface Props {
  visible: boolean
  data: any
}

const emits = defineEmits(['update:visible'])

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  data: () => ({})
})

const copy = () => {
  navigator.clipboard.writeText(props.data)
}
</script>
