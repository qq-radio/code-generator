const schemaMap = new Map<Form.SchemaType, Form.DomainSchemaItem>()

register()

function register() {
  const modules: Record<string, any> = import.meta.glob('@/domain/**/schemas/*.ts', {
    eager: true,
    import: 'default'
  })

  for (const path in modules) {
    const name = path.replace(/^.*\/([^\/]+)\.ts$/, '$1') as Form.SchemaType
    const value = modules[path] as Form.DomainSchemaItem
    schemaMap.set(name, value)
  }
}

function getSchema(type: Form.SchemaType) {
  return schemaMap.get(type)
}

export { getSchema }
