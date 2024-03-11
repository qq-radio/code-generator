import type { Config } from '@/types'

const codeConfigs = getConfigs()

function getConfigs() {
  const modules: Record<string, Config> = import.meta.glob('./modules/*.ts', {
    eager: true,
    import: 'default'
  })
  return Object.values(modules) as Config[]
}

export { codeConfigs }
