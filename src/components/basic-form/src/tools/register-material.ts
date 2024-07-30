import type { CustomComponentType } from '../types/form'
import type { Component } from 'vue'
import Vue from 'vue'

register()

function register() {
  const modules = import.meta.glob('../material/*.vue', {
    eager: true,
    import: 'default'
  })

  for (const path in modules) {
    const name = path.replace(/^.*\/([^\/]+)\.vue$/, '$1') as CustomComponentType
    const value = modules[path] as Component
    // @ts-ignore todo
    Vue.component(name, value)
  }
}
