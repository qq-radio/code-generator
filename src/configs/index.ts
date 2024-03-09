import type { GlobalConfig, Config } from '@/types'

const globalConfig: GlobalConfig = {
  codeType: 'TABLE',
  yapiDomain: 'yapiDomain',
  projectToken: '1b79d84815ed81bb516a9eb8649609391a8feac0480f9bf2892f82d46efec195',
  interfaceId: '64164',
  requestPropertyKeyPath: 'data.req_body_other.properties',
  responsePropertyKeyPath: 'data.res_body.properties.data.properties.records.items.properties',
  downloadFileName: {
    interface: 'interfaceData',
    schema: 'schema'
  }
}

const codeConfigs = getConfigs()

function getConfigs() {
  const modules: Record<string, Config> = import.meta.glob('./modules/*.ts', {
    eager: true,
    import: 'default'
  })
  return Object.values(modules) as Config[]
}

export { globalConfig, codeConfigs }
