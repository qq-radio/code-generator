import type { ApiItem } from '@/types'
import { capitalizeFirstLetter } from '@/utils'

function checkHasPathVariable(path: string) {
  return /\/{[^}]+}/.test(path)
}

function removePathVariable(path: string) {
  return path.replace(/\/{[^}]+}/g, '')
}

function pathToNameByTwoWord(path: string) {
  return path.replace(/.*\/(\w+)\/(\w+)/, (_match, word1, word2) => {
    return `${word1}${capitalizeFirstLetter(word2)}`
  })
}

function pathToNameByOneWord(path: string) {
  return path.replace(/.*\/(\w+)\/(\w+)/, (_match, word1, word2) => {
    console.log('word1:', word1)
    return word2
  })
}

function pathToName(params, number) {
  return number === 1 ? pathToNameByOneWord(params, number) : pathToNameByTwoWord(params, number)
}

function getPath(path: string) {
  return path.replace(/\{(\w+)\}/, '${' + '$1' + '}')
}

export function generateApiFile(apis: ApiItem[], serviceName = 'todoService', wordNumber = 1) {
  let content = ''

  apis.forEach((api) => {
    const hasPathVariable = checkHasPathVariable(api.path)

    const description = api.title

    const name = hasPathVariable
      ? pathToName(removePathVariable(api.path), wordNumber)
      : pathToName(api.path, wordNumber)

    const requestKey = hasPathVariable ? 'id' : 'data'

    const method = api.method.toLowerCase()

    const requestPath = getPath(api.path)

    content += `// ${description} \n export const ${name}Api = ${requestKey} => request.${method}(\`${requestPath}\`,  ${requestKey}) \n\n`
  })

  const outputFileContent = `import { ${serviceName} as request } from '@/services/service'; \n\n ${content}`

  return outputFileContent
}

export function generateApiFileNew(apis: ApiItem[], options: { serviceName: any; serviceUrl: any; wordNumber: any }) {
  const { serviceName = 'todoService', serviceUrl = 'todoServiceUrl', wordNumber = 1 } = options

  let content = ''

  apis.forEach((api) => {
    const hasPathVariable = checkHasPathVariable(api.path)

    const description = api.title

    const name = hasPathVariable
      ? pathToName(removePathVariable(api.path), wordNumber)
      : pathToName(api.path, wordNumber)

    let requestKey = hasPathVariable ? 'id' : 'data'

    const method = api.method.toLowerCase()

    const requestKeyResult = method == 'get' ? ' { params: data }' : requestKey

    // 这是以前
    // const requestPath = getPath(api.path)
    // 这是现在，拿取最后一个单词
    const requestPath = api.path.substring(api.path.lastIndexOf('/'))

    if (api.path.includes('import') || api.path.includes('export')) {
      content += `// ${description} \n export const ${name}Url = \`\${BASE_SERVICE_URL}${requestPath}\`\n\n`
    } else {
      content += `// ${description} \n export const ${name}Api = ${requestKey} => request.${method}(\`\${BASE_SERVICE_URL}${requestPath}\`,  ${requestKeyResult}) \n\n`
    }
  })

  const base = `const BASE_SERVICE_URL = '${serviceUrl}'\n\n`

  // 这是之前绩效的
  // const outputFileContent = `import { axios } from '@/utils/request';\n\n${base}\n\n${content}`

  // 现在换成中台的
  const outputFileContent = `import request from "@/router/axios";\n\n${base}\n\n${content}`

  return outputFileContent
}
