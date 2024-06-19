<route lang="json">
{
  "meta": {
    "sort": 6
  }
}
</route>

<template>
  <div class="dddd" @click="clickhusky">husky{{ a }}</div>
  <div @click="clickhusky">husky</div>
</template>

<script lang="ts">
export default {
  name: 'HuskyTestIndex'
}
</script>
<script lang="ts" setup>
const a = ref({
  b: 'bbbb'
})
const clickhusky = () => {}
</script>

<style lang="less">
.dddd {
  color: #eee;
}
</style>
