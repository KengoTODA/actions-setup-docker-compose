import {install, runCommand} from '../src/install'
import * as core from '@actions/core'

import {expect, test} from '@jest/globals'

test('runCommand', async () => {
  const result = await runCommand('echo foo bar')
  expect(result).toBe('foo bar')
})

async function testVersion(version: string) {
  const commandPath = await install(version)
  core.addPath(commandPath)
  const result = await runCommand('docker-compose version')
  expect(result).toContain(version)
}

test('Install the right version', async () => {
  await testVersion('1.29.1')
  await testVersion('1.29.2')
  await testVersion('2.2.3')
  await testVersion('v2.2.3')
  await testVersion('v2.10.2')
})
