const router = require('koa-router')()
const formidable = require('formidable')
const path = require("path")
const fs = require('fs');
const fsPromises = fs.promises;

// const axios = require('axios');
// 上传封面
router.post("/upload/img", upload('image'));
router.post("/upload/video", upload('video'));

router.post("/upload/editor/img", uploadEditor('image'));

const mv = async (sourcePath, destPath) => {
  return fsPromises.rename(sourcePath, destPath);
};

const getType = (str) => {
  return str.replace(/.+(?=\.)/g, '')
}

function upload(url) {
  return async function (ctx, next) {
    await next()
    let form = new formidable.IncomingForm();
    // 设定数据格式
    form.encoding = 'utf-8';
    // 设定路径
    form.uploadDir = path.join(__dirname + "/../../public/upload/" + url);
    // 设置文件大小
    form.maxFieldsSize = 500 * 1024 * 1024;//上传文件的最大大小
    form.maxFileSize = 500 * 1024 * 1024;//上传文件的最大大小
    form.keepExtensions = true;
    form.multiples = true;
    // 存储文件
    const files = await new Promise((resolve, reject) => {
      try {
        form.parse(ctx.req, async (err, fields, { file }) => {
          try {
            if (err) { resolve([]); return; }
            if (Array.isArray(file)) {
              const list = file.map(el => {
                const { filepath, newFilename, originalFilename } = el;
                const _filePath = `${filepath}${getType(originalFilename)}`;
                mv(filepath, _filePath);
                return {
                  fileName: originalFilename.replace(/(?=\.).+/g, ''),
                  filePath: _filePath
                }
              })
              resolve(list)
            } else {
              const { filepath, newFilename, originalFilename } = file;
              const _filePath = `${filepath}${getType(originalFilename)}`
              mv(filepath, _filePath);
              resolve([{ fileName: originalFilename.replace(/(?=\.).+/g, ''), filePath: _filePath }])
            }
          } catch (error) {
            resolve([])
          }
        })
      } catch (error) {
        resolve([])
      }
    })
    const bool = !!files.length;
    // const response = await axios.post('http://127.0.0.1:5000/api/image', {
    //   files
    // });
    // const thumbs = response.data.data;
    // 返回信息
    ctx.body = { status: 200, message: bool ? '上传成功' : '上传失败,请联系管理员', errno: 0, data: files }
  }
}

function uploadEditor(url) {
  return async function (ctx, next) {
    await next()
    let form = new formidable.IncomingForm();
    // 设定数据格式
    form.encoding = 'utf-8';
    // 设定路径
    form.uploadDir = path.join(__dirname + "/../../public/upload/" + url);
    // 设置文件大小
    form.maxFieldsSize = 500 * 1024 * 1024;//上传文件的最大大小
    form.maxFileSize = 500 * 1024 * 1024;//上传文件的最大大小
    form.keepExtensions = true;
    form.multiples = true;
    // 存储文件
    const files = await new Promise((resolve, reject) => {
      try {
        form.parse(ctx.req, async (err, fields, { file }) => {
          try {
            if (err) { resolve([]); return; }
            if (Array.isArray(file)) {
              const list = file.map(el => {
                const { filepath, newFilename, originalFilename } = el;
                const _filePath = `${filepath}${getType(originalFilename)}`;
                mv(filepath, _filePath);
                return {
                  fileName: originalFilename.replace(/(?=\.).+/g, ''),
                  filePath: _filePath
                }
              })
              resolve(list)
            } else {
              const { filepath, newFilename, originalFilename } = file;
              const _filePath = `${filepath}${getType(originalFilename)}`
              mv(filepath, _filePath);
              resolve([{ fileName: originalFilename.replace(/(?=\.).+/g, ''), filePath: _filePath }])
            }
          } catch (error) {
            resolve([])
          }
        })
      } catch (error) {
        resolve([])
      }
    })
    const bool = !!files.length;
    // 返回信息
    ctx.body = {
      status: 200, message: bool ? '上传成功' : '上传失败,请联系管理员', errno: 0, data: {
        url: bool ? files[0].filePath : ''
      }
    }
  }
}
export default router;