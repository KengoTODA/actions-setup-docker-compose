import * as core from '@actions/core'
import {install} from './install'
import {Octokit} from '@octokit/action'

async function findLatestVersion() {
  const octokit = new Octokit()
  const response = await octokit.repos.getLatestRelease({
    owner: 'docker',
    repo: 'compose'
  })
  return response.data.tag_name
}

async function run(): Promise<void> {
  try {
    let version: string = core.getInput('version', {
      required: true
    })
    if (version === 'latest') {
      version = await findLatestVersion()
    }
    const commandPath = await install(version)
    core.addPath(commandPath)
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : 'Unknown error')
  }
}

run()
