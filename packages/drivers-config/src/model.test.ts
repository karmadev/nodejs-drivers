import { Config } from './model'

test('Config', () => {
  const envVars = {
    OTHER_KEY: 'should not be accessible',
    PRE_KEY: 'test',
    EXTERNAL_KEY: 'val',
  }

  const config = Config('PRE_', envVars, ['EXTERNAL_KEY'])

  expect(config).toEqual({ KEY: 'test', EXTERNAL_KEY: 'val' })
})
