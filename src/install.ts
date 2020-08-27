import {exec} from '@actions/exec'
import {downloadTool} from '@actions/tool-cache'

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

export async function install(version: string): Promise<string> {
  const system = runCommand('uname -s')
  const hardware = runCommand('uname -m')
  const url = `https://github.com/docker/compose/releases/download/${version}/docker-compose-${await system}-${await hardware}`
  const installerPath = await downloadTool(url)
  await exec(`chmod +x ${installerPath}`)
  return installerPath
}
