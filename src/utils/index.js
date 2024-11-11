const { download } = require('electron-dl');
const AdmZip = require('adm-zip');

const fs = require('fs');
const path = require("path");

const axios = require('axios');
import { readFile } from '../utils/fn.js'

const uploadFilePath = path.join(__dirname, '../../public/version.json')

export const checkForUpdates = (mainWindow, BrowserWindow) => {
    // 代理地址
    var p = {
        host: "47.97.109.129", //代理服务器地址
        port: 3000,//端口
    };
    // 版本更新地址
    axios.get("http://47.97.109.129:3000/uploadToConfigParam", { proxy: p }).then(async (response) => {
        try {
            const { data } = response.data;
            // 版本 进程主文件 进行页面文件 node服务静态文件 node服务index文件
            const { version, build, renderer, dist, views } = data;
            // 本地版本信息
            const localVersion = readFile(uploadFilePath)
            const { version: lv } = localVersion;
            // 本地版本
            const v1 = lv[lv.length - 1].version;
            // 判断是不是最新版本
            if (v1 != version) {
                const win = BrowserWindow.getFocusedWindow()
                const downloadPath = path.join(__dirname, "../../public/download")
                const m = { dist, views }
                const fileName = {
                    build: "build",
                    renderer: "renderer",
                    dist: "dist",
                    views: "index.html",
                }
                const filePath = {
                    build: "..",
                    renderer: "..",
                    dist: "../../public",
                    views: "../../views",
                }
                const downFiles = []
                for (let k in m) {
                    const v = m[k]
                    if (v) {
                        const url = `http://47.97.109.129:3000${v}`;
                        const option = {
                            directory: downloadPath,
                            overwrite: true,
                        };
                        const f = await download(win, url, option)
                        downFiles.push({ k, v: f.getSavePath() })
                    }
                }
                // 解压文件
                console.log(downFiles)
                for (let i in downFiles) {
                    const { k, v } = downFiles[i]
                    const extractDir = path.join(__dirname, filePath[k])

                    const zip = new AdmZip(v);
                    zip.getEntries().forEach((entry) => {
                        const fullPath = path.join(extractDir, entry.entryName);

                        if (entry.isDirectory) {
                            // 如果条目是文件夹，确保其存在
                            if (!fs.existsSync(fullPath)) {
                                fs.mkdirSync(fullPath, { recursive: true });
                            }
                        } else {
                            // 如果条目是文件，写入文件内容
                            fs.writeFileSync(fullPath, entry.getData());
                        }
                    });


                    const extractedItems = fs.readdirSync(extractDir);
                    console.log(extractedItems)
                    // 仅重命名第一个解压的文件或文件夹
                    // const oldPath = path.join(extractDir, extractedItems[0]);
                    // const newPath = path.join(extractDir, fileName[k]);

                    // 3. 重命名解压后的文件/文件夹
                    // fs.renameSync(oldPath, newPath);
                }
            }
        } catch (error) {
            console.log('proxy', error)

        }
    })


}


