const port = 3000;
// 导入所需的模块
const path = require("path");
const Koa = require('koa');
const Router = require('koa-router');
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors');
const views = require('koa-views')
const range = require('koa-range')

// 路由
import index from './route/index.js';
// // 文件上传
import upload from './route/upload.js'



const httpServe = ({ mainWindow }) => {
    // 创建一个 Koa 应用程序实例
    const app = new Koa();
    const router = new Router();

    // middlewares
    app.use(cors());
    app.use(bodyParser({
        enableTypes: ['json', 'form', 'text']
    }))
    app.use(range)
    app.use(json())
    app.use(require('koa-static')(path.join(__dirname + '/../../public')))
    app.use(views(path.join(__dirname + '/../../views'), {
        map: {
            html: 'ejs'
        }
    }))
    // 视频
    router.get('/reset', async (ctx, next) => {
        next()
        // 给程序进程发送信
        mainWindow.webContents.send("reset", "");
        // 返回请求信息
        ctx.body = {
            status: 200,
            msg: '请求成功',
            data: ""
        }
    })
    // 将路由注册到 Koa 应用程序实例
    app.use(router.routes());
    app.use(router.allowedMethods());

    // 页面路径
    app.use(index.routes());
    // // 文件上传
    app.use(upload.routes());

    // 监听端口并启动服务
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}

export default httpServe