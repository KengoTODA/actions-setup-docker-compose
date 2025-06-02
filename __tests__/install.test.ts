import {install, runCommand} from '../src/install'
import * as core from '@actions/core'

import {describe, expect, it, test} from '@jest/globals'

describe('runCommand', () => {
  it('runs a command and returns its stdout', async () => {
    const result = await runCommand('echo foo bar')
    expect(result).toBe('foo bar')
  })
})

describe('install', () => {
  const cases = ['1.29.1', '1.29.2', '2.2.3', 'v2.2.3', 'v2.10.2']
  test.each(cases)('can install version %p', async (version: string) => {
    const commandPath = await install(version)
    core.addPath(commandPath)
    const result = await runCommand('docker-compose version')
    expect(result).toContain(version)
  })
  it('can install latest version', async () => {
    // Skip this test if GITHUB_TOKEN is not available
    if (!process.env.GITHUB_TOKEN) {
      console.log('Skipping latest version test - GITHUB_TOKEN not available')
      return
    }

    try {
      const commandPath = await install('latest')
      core.addPath(commandPath)
      const result = await runCommand('docker-compose version')
      expect(result).not.toBeFalsy()
    } catch (error) {
      // If we get a network error, skip the test since we can't access GitHub API
      if (
        error instanceof Error &&
        (error.message.includes('fetch failed') ||
          error.message.includes('EAI_AGAIN'))
      ) {
        console.log(
          'Skipping latest version test - Network access to GitHub API not available'
        )
        return
      }
      throw error
    }
  })
})
