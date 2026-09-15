import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test
} from '@jest/globals'
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import * as toolCache from '@actions/tool-cache'
import type {ExecOptions} from '@actions/exec'

const downloadTool = jest.fn<typeof toolCache.downloadTool>()
const exec = jest.fn(
  async (command: string, _args?: string[], options?: ExecOptions) => {
    const output = command === 'uname -s' ? 'Linux\n' : 'x86_64\n'
    options?.listeners?.stdout?.(Buffer.from(output))
    return 0
  }
)
jest.unstable_mockModule('@actions/tool-cache', () => ({
  ...toolCache,
  downloadTool
}))
jest.unstable_mockModule('@actions/exec', () => ({exec}))
const {install} = await import('../src/install')

let temp: string
let installer: string
const platformDescriptor = Object.getOwnPropertyDescriptor(process, 'platform')!
beforeEach(async () => {
  temp = await mkdtemp(join(tmpdir(), 'compose-cache-test-'))
  installer = join(temp, 'download')
  await writeFile(installer, 'docker-compose fixture', {mode: 0o755})
  Object.defineProperty(process, 'platform', {value: 'linux'})
  jest.replaceProperty(process, 'env', {
    ...process.env,
    RUNNER_TOOL_CACHE: join(temp, 'cache'),
    GITHUB_TOKEN: 'fake-token-for-testing'
  })
  downloadTool.mockResolvedValue(installer)
})
afterEach(async () => {
  Object.defineProperty(process, 'platform', platformDescriptor)
  jest.restoreAllMocks()
  await rm(temp, {recursive: true, force: true})
})

describe('tool cache reuse', () => {
  test.each(['1.29.2', '2.10.2', 'v2.10.2', 'latest'])(
    'returns a cached %s without commands or downloads',
    async version => {
      const resolved = version === 'latest' ? 'v2.10.2' : version
      const cached = await toolCache.cacheFile(
        installer,
        'docker-compose',
        'docker-compose',
        resolved
      )
      expect(await install(version)).toBe(cached)
      expect(downloadTool).not.toHaveBeenCalled()
      expect(exec).not.toHaveBeenCalled()
    }
  )

  test.each([
    ['1.29.2', '1.29.2'],
    ['2.10.2', 'v2.10.2'],
    ['v2.10.2', 'v2.10.2']
  ])('downloads missing %s once and reuses it', async (version, tag) => {
    const cached = await install(version)
    expect(downloadTool).toHaveBeenCalledWith(
      `https://github.com/docker/compose/releases/download/${tag}/docker-compose-Linux-x86_64`
    )
    expect(exec).toHaveBeenCalledWith(`chmod +x ${installer}`)
    expect(await readFile(join(cached, 'docker-compose'), 'utf8')).toBe(
      'docker-compose fixture'
    )
    exec.mockClear()
    expect(await install(tag)).toBe(cached)
    expect(downloadTool).toHaveBeenCalledTimes(1)
    expect(exec).not.toHaveBeenCalled()
  })
})
