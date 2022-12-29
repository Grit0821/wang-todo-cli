const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
  const list = await db.read()
  list.push({ title, done: false })
  await db.write(list)
}

module.exports.clear = async () => {
  await db.write([])
}

module.exports.showAll = async () => {
  const list = await db.read()
  printTasks(list)
}


const printTasks = (list) => {
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'index',
        message: '请选择你想操作的任务',
        choices: [
          { name: '+ 创建新任务', value: '-2' },
          ...list.map((task, index) => ({
            name: `${task.done ? '[√]' : '[ ]'} ${index + 1} - ${task.title}`,
            value: index.toString()
          })),
          { name: '退出', value: '-1' },
        ]
      }
    )
    .then(answer => {
      const index = parseInt(answer.index)
      if (index >= 0) {
        askForAction(list, index)
      } else if (index === -2) {
        addNewTask(list)
      }
    })
}

// 对已有任务进行操作
const askForAction = (list, index) => {
  const actions = {
    markAsUndone,
    markAsDone,
    updateTitle,
    remove,
    quit,
  }

  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: '请选择操作',
      choices: [
        { name: '返回', value: 'quit' },
        { name: '标记为已完成', value: 'markAsDone' },
        { name: '标记为未完成', value: 'markAsUndone' },
        { name: '修改标题', value: 'updateTitle' },
        { name: '删除', value: 'remove' },
      ]
    })
    .then(answer => {
      const action = actions[answer.action]
      action(list, index)
    })
}

const quit = (list, index) => {
  printTasks(list)
}

const markAsDone = (list, index) => {
  list[index].done = true
  db.write(list)
  printTasks(list)
}

const markAsUndone =  (list, index) => {
  list[index].done = false
  db.write(list)
  printTasks(list)
}

const remove =  (list, index) => {
  list.splice(index, 1)
  db.write(list)
  printTasks(list)
}

const updateTitle = (list, index) => {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: '新的标题',
      default: list[index].title
    })
    .then(async (answer) => {
      list[index].title = answer.title
      await db.write(list)
      printTasks(list)
    })
}


// 创建新的任务
const addNewTask = (list) => {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: '输入任务标题',
    })
    .then(async answer => {
      list.push({
        title: answer.title,
        done: false
      })
      await db.write(list)
      printTasks(list)
    })
}