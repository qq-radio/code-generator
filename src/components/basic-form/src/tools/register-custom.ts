import type { App, Component } from 'vue'

function register(app: App) {
  const modules = import.meta.glob('../customs/*.vue', {
    eager: true,
    import: 'default'
  })

  for (const path in modules) {
    const name = path.replace(/^.*\/([^\/]+)\.vue$/, '$1') as Form.CustomComponentType
    const value = modules[path] as Component
    app.component(name, value)
  }
}

export { register }
