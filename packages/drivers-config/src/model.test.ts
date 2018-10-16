import { Config } from './model'

test('Config', () => {
  const envVars = {
    OTHER_KEY: 'should not be accessible',
    PRE_KEY: 'test',
  }

  const config = Config('PRE_', envVars)

  expect(config).toEqual({ KEY: 'test' })
})
