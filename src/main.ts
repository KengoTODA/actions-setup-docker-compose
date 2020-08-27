import * as core from '@actions/core'
import {install} from './install'

async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version', {
      required: true
    })
    const commandPath = await install(version)
    core.addPath(commandPath)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
