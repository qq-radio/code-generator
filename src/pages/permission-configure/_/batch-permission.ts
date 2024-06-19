import readline from 'readline'
import { adminInterfacePostApi } from '@/https/admin'

const defaultParams = {
  menuType: 0,
  sort: 1,
  invisible: false,
  belongSystem: ['code'],
  businessSystemId: '8'
}

type ActionTextMap = { [key: string]: string }
const actionTextMap: ActionTextMap = {
  add: '新增',
  edit: '编辑',
  view: '查看',
  import: '导入',
  export: '导出',
  status: '启用/禁用'
}

function getActionTextMap(action: string | undefined) {
  return action ? actionTextMap[action] : '按钮'
}

function ask(rl: any, prompt: any) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer: string) => {
      resolve(answer)
    })
  })
}

async function askQuestion() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const parentId = await ask(rl, 'Please input parentId: ')
  const permissions = await ask(rl, 'Please input permissions: ')

  rl.close()

  return {
    parentId,
    permissions
  }
}

async function main() {
  const { parentId, permissions } = await askQuestion()

  for (const code in permissions) {
    const action = code.match(/\.(\w+)$/)?.[1]
    const name = getActionTextMap(action)

    await adminInterfacePostApi({
      ...defaultParams,
      parentId,
      name,
      code
    })
  }
}

main()

// 参考它们
export const TrainListPermission = {
  ADD: 'promoterTrain.train.trainList.add',
  EXPORT: 'promoterTrain.train.trainList.export'
}

export const QuestionDatabasePermission = {
  ADD: 'promoterTrain.train.questionDatabase.add',
  IMPORT: 'promoterTrain.train.questionDatabase.import',
  EXPORT: 'promoterTrain.train.questionDatabase.export',
  EDIT: 'promoterTrain.train.questionDatabase.edit',
  DELETE: 'promoterTrain.train.questionDatabase.delete'
}
