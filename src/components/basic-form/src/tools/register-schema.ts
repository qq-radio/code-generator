import type { SchemaType, DomainFormSchema } from '../types/form'

type SchemaMap = Map<SchemaType, DomainFormSchema>

const schemaMap: SchemaMap = new Map()

register()

function register() {
  const modules: Record<string, any> = import.meta.glob('@/domain/**/schemas/*.ts', {
    eager: true,
    import: 'default'
  })

  for (const path in modules) {
    const name = path.replace(/^.*\/([^\/]+)\.ts$/, '$1') as SchemaType
    const value = modules[path] as DomainFormSchema
    schemaMap.set(name, value)
  }
}

function getSchema(type: SchemaType) {
  return schemaMap.get(type)
}

export { getSchema }
