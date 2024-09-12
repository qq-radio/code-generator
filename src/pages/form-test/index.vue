<route lang="json">
{
  "meta": {
    "sort": 0
  }
}
</route>

<template>
  <!-- but it worth to do, and must to do
  <BasicForm :schema="formSchema" /> -->
</template>

<script setup lang="ts">
// import { Recordable } from '../../types/global'

const obj: Recordable = {
  a: 1,
  b: 1
}

// import { normalizeSchema } from '@/components/basic-form/src/tools/normalize-schema'

// const formSchema = [
//   {
//     label: '基地',
//     prop: 'baseId',
//     type: 'base-select',
//     componentProps: {
//       extraFields: [['baseName', 'departName']]
//     }
//   },
//   {
//     label: '产品名称',
//     prop: 'prodName',
//     component: 'input'
//   },
//   {
//     label: '标准岗位系数和',
//     prop: 'totalStanPostCoefficient',
//     component: 'input-number'
//   }
// ]

// const r = normalizeSchema(formSchema)
// console.log('先这样吧 rrrrrrrr r:', r)
</script>
