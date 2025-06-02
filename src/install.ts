import {cacheFile, downloadTool} from '@actions/tool-cache'
import {exec} from '@actions/exec'
import * as core from '@actions/core'
import {Octokit} from '@octokit/action'

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
  if (!version.startsWith('v') && parseInt(version.split('.')[0], 10) >= 2) {
    version = `v${version}`
  }
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

// Default implementation for GitHub API call
export async function getLatestReleaseTag(
  owner: string,
  repo: string
): Promise<string> {
  const octokit = new Octokit()
  const response = await octokit.repos.getLatestRelease({
    owner,
    repo
  })
  return response.data.tag_name
}

// Allow overriding the implementation for testing
let getLatestReleaseTagImpl = getLatestReleaseTag

export function setGetLatestReleaseTagImpl(
  impl: typeof getLatestReleaseTag
): void {
  getLatestReleaseTagImpl = impl
}

async function findLatestVersion(): Promise<string> {
  return await getLatestReleaseTagImpl('docker', 'compose')
}

export async function install(version: string): Promise<string> {
  if (version === 'latest') {
    version = await findLatestVersion()
    core.info(`Requested to use the latest version: ${version}`)
  }
  switch (process.platform) {
    case 'linux':
      return installOnLinux(version)
    default:
      throw new Error(`Unsupported platform: ${process.platform}`)
  }
}
