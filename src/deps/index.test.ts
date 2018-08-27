import { makeServerDeps } from '.'
import { LoggerMock } from '../drivers/logger'

test('makeServerDeps', () => {
  expect(() =>
    makeServerDeps({
      config: {
        envVars: { PRE_LOG_LEVEL: 'error', PRE_GCP_PROJECT_ID: 'id' },
        prefix: 'PRE_',
      },
      logger: new LoggerMock(),
    })
  ).not.toThrow()
})
