import { createRouter, createWebHistory } from 'vue-router'
import SchemaGeneratorIndex from '@/views/schema-generator/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'schema-generator',
      component: SchemaGeneratorIndex
    }
  ]
})

export default router
