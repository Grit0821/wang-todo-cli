
const homedir = require('os').homedir()
// 数据文件存储的路径 home
const home = process.env.HOME || homedir

const path = require('path')
const fs = require('fs')
const dbPath = path.join(home, '.todo')


const db = {
  read: (path = dbPath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: 'a+' }, (err, data) => {
        if (err) {
          reject(err)
        }
        const list = JSON.parse(data.toString()) || []
        resolve(list)
      })
    })
  },
  write: (list, path = dbPath) => {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(list)
      fs.writeFile(path, string, (error) => {
        if(error) {
          reject(error)
        }
        resolve()
      })
    })
  }
}

module.exports = db