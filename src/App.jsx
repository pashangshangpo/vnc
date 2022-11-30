import { path, shell } from '@tauri-apps/api'
import { useEffect } from 'react'

import './App.less'

function App() {
  useEffect(() => {
    const run = localStorage.getItem('run-vnc')

    if (!run) {
      init()
    }
  }, [])

  const init = async () => {
    localStorage.setItem('run-vnc', 1)

    const resourceDir = await path.resourceDir()
    const publicDir = await path.join(resourceDir, 'public')
    const exePath = await path.join(publicDir, 'main.exe')
    const indexPath = await path.join(publicDir, 'index.js')

    const command = shell.Command.sidecar(
      'bin/n',
      [
        '--no-warnings',
        indexPath,
        exePath
      ]
    )

    command.stdout.on('data', line => {
      console.log(line)
    })

    command.stderr.on('data', (...line) => {
      console.log(...line)
    })

    command.execute()
  }

  return (
    <div className='app'>
      Hello World
    </div>
  )
}

export default App
