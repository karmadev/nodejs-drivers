import { makeServerDeps } from './deps'

test('app', () => {
  const deps = makeServerDeps({
    envVars: {
      PRE_LOG_LEVEL: 'error',
      PRE_SERVER_PORT: '9896',
      PRE_GCP_PROJECT_ID: 'id',
    },
    prefix: 'PRE_',
  })
  return deps.drivers.init().then((data: any) =>
    data.close().then(() => {
      expect(data.serverPort).toEqual('9896')
    })
  )
})

const makeModule = ({ deps }) => {
  const model = {
    getUserById: args => {
      return Promise.resolve(
        [{ id: '123-abc', name: 'Marcus Nielsen' }].find(
          user => user.id === args.userId
        )
      )
    },
  }
  const routes = [
    {
      contentType: 'application/json',
      method: 'get',
      model: 'getUserById',
      params: ['userId'],
      url: 'getUserById',
    },
  ]
  deps.drivers.initRoutes({ routes, model })
  return {
    model,
  }
}

test('Module handles request successfully', () => {
  const deps = makeServerDeps({
    envVars: {
      PRE_LOG_LEVEL: 'error',
      PRE_SERVER_PORT: '9897',
      PRE_GCP_PROJECT_ID: 'id',
    },
    prefix: 'PRE_',
  })
  makeModule({ deps })
  return deps.drivers.init().then((data: any) =>
    deps.drivers
      .httpReq({
        url: 'http://localhost:9897/getUserById/123-abc',
        body: {},
        method: 'get',
        authToken: '',
      })
      .then(response =>
        data.close().then(() => {
          expect(response).toEqual({
            id: '123-abc',
            name: 'Marcus Nielsen',
          })
        })
      )
  )
})
