export const generateColumnRequestSchema = (requestProps: any) => {
  const schemas = []
  for (const key in requestProps) {
    schemas.push({
      title: requestProps[key].description,
      dataIndex: key,
      searchConfig: {
        label: requestProps[key].description,
        field: key,
        component: 'Input'
      }
    })
  }

  return schemas
}
