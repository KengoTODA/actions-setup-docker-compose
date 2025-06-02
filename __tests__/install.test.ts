import {describe, expect, it, test, jest, beforeEach} from '@jest/globals'

import {install, runCommand, setGetLatestReleaseTagImpl} from '../src/install'
import * as core from '@actions/core'

describe('runCommand', () => {
  it('runs a command and returns its stdout', async () => {
    const result = await runCommand('echo foo bar')
    expect(result).toBe('foo bar')
  })
})

describe('install', () => {
  // Mock the GitHub API call for the latest version test
  beforeEach(() => {
    setGetLatestReleaseTagImpl(jest.fn().mockResolvedValue('v2.30.0'))
  })

  const cases = ['1.29.1', '1.29.2', '2.2.3', 'v2.2.3', 'v2.10.2']
  test.each(cases)('can install version %p', async (version: string) => {
    const commandPath = await install(version)
    core.addPath(commandPath)
    const result = await runCommand('docker-compose version')
    expect(result).toContain(version)
  })
  it('can install latest version', async () => {
    const commandPath = await install('latest')
    core.addPath(commandPath)
    const result = await runCommand('docker-compose version')
    expect(result).toContain('v2.30.0')
  })
})
