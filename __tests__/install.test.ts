import {runCommand} from '../src/install'
import {expect, test} from '@jest/globals'

test('runCommand', async () => {
  const result = await runCommand('echo foo bar')
  expect(result).toBe('foo bar')
})
