import { makeConfig } from './index'

test('makeConfig', () => {
  const envVars = {
    OTHER_KEY: 'should not be accessible',
    PRE_KEY_1: 'false',
    PRE_KEY_2: 'test',
    PRE_KEY_3: '__SKIP__',
  }

  const config = makeConfig({
    envVars,
    prefix: 'PRE_',
    removeToken: '__SKIP__',
  })

  expect(config).toEqual({ KEY_1: false, KEY_2: 'test' })
})
