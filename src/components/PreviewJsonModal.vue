<template>
  <a-drawer title="JSON预览" class="custom-class" v-model:open="props.visible" :width="600" placement="right"
            @close="onClose">
    <VueJsonPretty :data="props.data" :deep="4" :show-length="true" :collapsedOnClickBrackets="true" :showIcon="true" />
  </a-drawer>
</template>

<script lang="ts" setup>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const emit = defineEmits(['update:visible', 'change']);

export interface Props {
  visible: boolean;
  data: any;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  data: () => ({})
})

const onClose = () => {
  emit('update:visible', false);
};
</script>
