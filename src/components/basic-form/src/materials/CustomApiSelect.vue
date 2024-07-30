<template>
  <div class="tw-inline-block">
    <a-select v-bind="$attrs" v-model="selectValues" :options="options" @change="emitChange" />
  </div>
</template>

<script>
import { mapObjectArrayFields } from '@/utils/util'
import { isFunction, isArray, get } from 'remeda'

export default {
  name: 'CustomApiSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    resultField: {
      type: String,
      default: () => ''
    },
    labelField: {
      type: String,
      default: ''
    },
    valueField: {
      type: String,
      default: ''
    },
    value: {
      type: [Array, String, Number]
    },
    api: {
      type: Function,
      required: true
    },
    isFreeze: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      options: [],
      selectValues: undefined
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.selectValues = v
      }
    }
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
        const datas = this.resultField ? get(result, this.resultField) : result
        this.options = this.handleDatas(datas)
      } catch (error) {
        console.error('CustomApiSelect Error:', error)
      }
    },

    handleDatas(options) {
      if (!isArray(options)) {
        return []
      }

      if (this.labelField && this.valueField) {
        return mapObjectArrayFields(options, {
          label: this.labelField,
          value: this.valueField
        })
      }
    },

    emitChange(value, option) {
      const valueItem = option?.data?.props || {}
      this.$emit('change', value, valueItem)
    }
  }
}
</script>
