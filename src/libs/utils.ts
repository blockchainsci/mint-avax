import path = require('path');
import fs = require('fs');

export function mkdirs(filepath: string) {

    if (fs.existsSync(filepath)) {
        return;
    }
    let lastDir = path.dirname(filepath);
    if (!fs.existsSync(lastDir)) {
        mkdirs(lastDir);
    }
    fs.mkdirSync(filepath);
}

export function writeFile(filepath: string, content: string) {
    filepath = path.resolve(filepath);
    mkdirs(path.dirname(filepath));
    fs.writeFileSync(filepath, content);
}


export function writeLog(name: string, content: string) {
    const filePath = path.join(__dirname, '../../.log', name);
    writeFile(filePath, content);
}

export enum LogColor {
    Default = 0,

    Yellow = 33,

    Blue = 34,

    // 亮色
    Bright = 1,

    // 品红
    Magenta = 35,
}

export function toLogRichText(text: string, color: LogColor = LogColor.Default): string {
    if (color === LogColor.Default) {
        return text;
    } else {
        return `\x1B[${color}m${text}\x1B[0m`;
    }
}

export function consoleLog(text: string, color: LogColor = LogColor.Yellow) {
    console.log(toLogRichText(text, color));
}

export function readFile2Str(filepath: string): string {
    if (!fs.existsSync(filepath)) {
        throw new Error(`readFile2Str: ${filepath} not exist`);
    }
    let content = fs.readFileSync(filepath, { encoding: 'utf-8' });
    return content;
}

// 从private文件夹读取私钥和地址
export function getPrivateKeys(name: string): string {
    let filePath = path.join(__dirname, '../../private', name);
    filePath = path.resolve(filePath);
    if (!fs.existsSync(filePath)) {
        throw new Error(`${filePath} not exist`);
    }
    let fileContent = readFile2Str(filePath);
    return fileContent;
}
