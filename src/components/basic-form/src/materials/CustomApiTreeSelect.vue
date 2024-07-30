<template>
  <a-tree-select
    v-bind="$attrs"
    v-model="selectValues"
    :treeData="treeData"
    treeNodeFilterProp="title"
    style="width: 100%"
    @change="emitChange"
  />
</template>

<script>
import { isFunction, get } from 'remeda'

export default {
  name: 'CustomApiTreeSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    resultField: {
      type: String,
      default: () => '',
    },
    labelField: {
      type: String,
      default: '',
    },
    valueField: {
      type: String,
      default: '',
    },
    value: {
      type: [Array, String, Number],
    },
    api: {
      type: Function,
    },
  },
  data() {
    return {
      treeData: [],
      selectValues: undefined,
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(v) {
        this.selectValues = v
      },
    },
  },
  created() {
    this.query()
  },
  methods: {
    async query() {
      try {
        if (!isFunction(this.api)) {
          return
        }

        const result = await this.api()
        this.treeData = this.resultField ? get(result, this.resultField) : result
      } catch (error) {
        console.error('CustomApiSelect Error:', error)
      }
    },

    emitChange(value, _label, extra) {
      const target = extra?.triggerNode?.dataRef || {}
      this.$emit('change', value, target)
    },
  },
}
</script>
