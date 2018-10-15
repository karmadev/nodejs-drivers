import { makeConfig } from './model'

test('makeConfig', () => {
  const envVars = {
    OTHER_KEY: 'should not be accessible',
    PRE_KEY: 'test',
  }

  const config = makeConfig({
    envVars,
    prefix: 'PRE_',
  })

  expect(config).toEqual({ KEY: 'test' })
})
