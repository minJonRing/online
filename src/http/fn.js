

const fs = require('fs');

export const readFile = (root) => {
    const jsonData = fs.readFileSync(root, 'utf8');
    return JSON.parse(jsonData)
}

export const saveFile = (root, data) => {
    const str = JSON.stringify(data)
    return fs.writeFileSync(root, str);
}

export default {
    readFile,
    saveFile
}