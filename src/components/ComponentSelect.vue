<template>
  <div>
    <a-select v-model:value="value" :options="componentOptions" style="width: 100%" allowClear />
  </div>
</template>

<script setup lang="ts">
const value = defineModel()

const componentOptions = Object.freeze([
  {
    label: 'input',
    value: 'input'
  },
  {
    label: 'input-number',
    value: 'input-number'
  },
  {
    label: 'textarea',
    value: 'textarea'
  },
  {
    label: 'select',
    value: 'select'
  },
  {
    label: 'date-picker',
    value: 'date-picker'
  },
  {
    label: 'time-picker',
    value: 'time-picker'
  }
  // 这个我用不到只是想说之前我预留了这个样的功能，啊 我很快就要看不懂自己写的什么代码了啊 啊
  // {
  //   label: 'ChannelType',
  //   value: 'ChannelType',
  //   property: {
  //     options: 'TODO',
  //     fieldNames: {
  //       label: 'channelName',
  //       value: 'id'
  //     }
  //   }
  // },
])
</script>
