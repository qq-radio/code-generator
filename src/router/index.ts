import { createRouter, createWebHistory } from 'vue-router'
import SchemaGeneratorIndex from '@/views/schema-generator/index.vue'
import HuskyTestIndex from '@/views/husky-test/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/schema-generator'
    },
    {
      path: '/schema-generator',
      name: 'schema-generator',
      component: SchemaGeneratorIndex
    },
    {
      path: '/husky-test',
      name: 'husky-test',
      component: HuskyTestIndex
    }
  ]
})

export default router
