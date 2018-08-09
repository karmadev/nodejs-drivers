import { makeConfig } from './index'

test('makeConfig', () => {
  const envVars = {
    OTHER_KEY: 'should not be accessible',
    PRE_KEY_1: 'false',
    PRE_KEY_2: 'test',
  }

  const config = makeConfig({
    envVars,
    prefix: 'PRE_',
  })

  expect(config).toEqual({ KEY_1: false, KEY_2: 'test' })
})
