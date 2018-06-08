import axios from 'axios'
import { makeDeps } from './deps'

test('app', () => {
  const deps = makeDeps({
    envVars: {
      PRE_LOG_LEVEL: 'error',
      PRE_SERVER_PORT: '9896',
    },
    prefix: 'PRE_',
    removeToken: '__NONE__',
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
  deps.drivers.router(routes[0], model[routes[0].model])
  return {
    model,
  }
}

test.skip('Module handles request successfully', () => {
  const deps = makeDeps({
    envVars: {
      PRE_LOG_LEVEL: 'error',
      PRE_SERVER_PORT: '9897',
    },
    prefix: 'PRE_',
    removeToken: '__NONE__',
  })
  makeModule({ deps })
  return deps.drivers.init().then((data: any) =>
    axios.get('http://localhost:9897/getUserById/123-abc').then(response =>
      data.close().then(() => {
        expect(response.data).toEqual({ id: '123-abc', name: 'Marcus Nielsen' })
      })
    )
  )
})
