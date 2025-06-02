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
    // Set GITHUB_TOKEN for this test
    process.env.GITHUB_TOKEN = 'fake-token-for-testing'
    const commandPath = await install('latest')
    core.addPath(commandPath)
    const result = await runCommand('docker-compose version')
    expect(result).not.toBeFalsy()
    // Clean up
    delete process.env.GITHUB_TOKEN
  })
  it('throws error when GITHUB_TOKEN is missing for latest version', async () => {
    // Ensure GITHUB_TOKEN is not set
    delete process.env.GITHUB_TOKEN
    await expect(install('latest')).rejects.toThrow(
      'GITHUB_TOKEN environment variable is required to fetch the latest version'
    )
  })
})
