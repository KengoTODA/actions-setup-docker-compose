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
  const system = runCommand('uname -s')
  const hardware = runCommand('uname -m')
  const url = `https://github.com/docker/compose/releases/download/${version}/docker-compose-${await system}-${await hardware}`
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
