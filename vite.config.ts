import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'
const resolve = (dir: string) => path.join(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      Components({}),
      VueRouter({}),
      vue(),
      vueJsx(),
      AutoImport({
        dts: resolve('./src/types/auto-imports.d.ts'),
        imports: [
          'vue',
          'pinia',
          'vue-router',
          {
            '@vueuse/core': []
          }
        ],
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json'
        }
      }),
      VueDevTools()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: '5000',
      proxy: {
        '/yapiServer': {
          target: env.VITE_YAPI_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/yapiServer/, '')
        },
        '/adminServer': {
          target: env.VITE_ADMIN_DEV_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/adminServer/, '')
        },
        '/adminServerTest': {
          target: env.VITE_ADMIN_TEST_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/adminServerTest/, '')
        }
      }
    }
  }
})
