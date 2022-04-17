import {cacheFile, downloadTool} from '@actions/tool-cache'
import {exec} from '@actions/exec'

export async function runCommand(command: string): Promise<string> {
  let output = ''
  const result = await exec(command, [], {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString()
      }
    }
  })
  if (result !== 0) {
    throw new Error(`Failed to run command: ${command}`)
  }
  return output.trim()
}

async function installOnLinux(version: string): Promise<string> {
  const system = await runCommand('uname -s')
  const hardware = await runCommand('uname -m')
  const casedSystem = version.startsWith('2') ? `${system[0].toUpperCase()}${system.slice(1)}` : system
  const url = `https://github.com/docker/compose/releases/download/${version}/docker-compose-${casedSystem}-${hardware}`
  const installerPath = await downloadTool(url)
  await exec(`chmod +x ${installerPath}`)
  const cachedPath = await cacheFile(
    installerPath,
    'docker-compose',
    'docker-compose',
    version
  )
  return cachedPath
}

export async function install(version: string): Promise<string> {
  switch (process.platform) {
    case 'linux':
      return installOnLinux(version)
    default:
      throw new Error(`Unsupported platform: ${process.platform}`)
  }
}
