import {runCommand} from '../src/install'

test('runCommand', async () => {
  const result = await runCommand('echo foo bar')
  expect(result).toBe('foo bar')
})
