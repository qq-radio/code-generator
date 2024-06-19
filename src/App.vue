<template>
  <div class="m-10 overflow-hidden border border-solid border-slate-300">
    <a-tabs v-model:activeKey="activeTab" type="card">
      <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.key">
        <RouterView />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTab } from '@/composables/useTab'

const { tabs, activeTab } = useTab()
</script>

<style lang="less">
@import './assets/main.css';

/deep/ .ant-collapse-header-text {
  font-weight: 600;
}
</style>
