import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import VueDevTools from 'vite-plugin-vue-devtools'

const resolve = (dir: string) => path.join(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      dts: resolve('./src/auto-imports.d.ts'),
      imports: [
        'vue',
        'pinia',
        'vue-router',
        {
          '@vueuse/core': []
        }
      ]
    }),
    VueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/yapiDomain': {
        target: 'https://xxx',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yapiDomain/, '')
      }
    }
  }
})
