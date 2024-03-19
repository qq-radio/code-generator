<template>
  <div class="dddd" @click="clickhusky">husky</div>
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
console.log({ a })
const clickhusky = () => {}
</script>

<style lang="less">
.dddd {
  color: #eee;
}
</style>
