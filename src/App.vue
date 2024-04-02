<template>
  <div class="m-10 overflow-hidden border border-solid border-slate-300">
    <a-tabs v-model:activeKey="activeKey" type="card">
      <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.key">
        <RouterView />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const activeKey = ref<string>('api-generator')

const tabs = ref([{ key: 'schema-generator' }, { key: 'api-generator' }, { key: 'husky-test' }])

watch(
  () => activeKey.value,
  () => {
    router.push({ path: `/${activeKey.value}` })
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
@import './assets/main.css';

/deep/ .ant-collapse-header-text {
  font-weight: 600;
}
</style>
