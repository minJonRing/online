const router = require('koa-router')()
const path = require("path");

import { readFile, saveFile } from '../fn'

router.get('/', async (ctx, next) => {
  await ctx.render('index')
})

const type = "data"
router.get('/getData', async (ctx, next) => {
  // const { type } = ctx.request.query
  const p = `../../public/db/${type}.json`;
  const filePath = path.join(__dirname, p)
  const jsonData = readFile(filePath)
  // 返回请求信息
  ctx.body = {
    status: 200,
    msg: '请求成功',
    data: jsonData
  }
}).post('/saveData', async (ctx, next) => {
  const {
    // path: {
    //   type
    // },
    data
  } = ctx.request.body;
  const p = `../../public/db/${type}.json`;
  const filePath = path.join(__dirname, p)
  saveFile(filePath, data)
  // 返回请求信息
  ctx.body = {
    status: 200,
    msg: '请求成功',
    data: ""
  }
})


export default router
