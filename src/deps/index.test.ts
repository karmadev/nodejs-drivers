import { makeServerDeps } from '.'

test('makeServerDeps', () => {
  expect(() =>
    makeServerDeps({
      envVars: { PRE_LOG_LEVEL: 'error' },
      prefix: 'PRE_',
      removeToken: '__NONE__',
    })
  ).not.toThrow()
})
