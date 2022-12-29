const db = require('../db.js')
const fs = require('fs')

jest.mock('fs')

describe('db', () => {

  afterEach(() => {
    fs.clearMocks()
  })

  it("can read", async () => {
    const data = [{ title: 'hi', done: false }]
    fs.setReadFileMock('/xxx', null, JSON.stringify(data))
    const list = await db.read('/xxx')
    expect(list).toStrictEqual(data)
  })

  it("can write", async () => {
    let fakeFile
    fs.setWriteFileMock('/yyy', (path, data, callback) => {
      fakeFile = data
      // callback 必须执行， 不然不知道写入 promise 是否成功
      callback(null)
    })
    const list = [{ title: '打球', done: true }]
    await db.write(list, '/yyy')
    expect(fakeFile).toBe(JSON.stringify(list))
  })
}) 