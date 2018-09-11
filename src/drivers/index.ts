import { makeDb } from './db'
import { PubSub } from './pub-sub'
import { makeServer } from './server'
import { makeUuid } from './uuid'
import * as jwt from './jwt'
import { httpReq } from './http-req'
import * as t from './types'

export const makeServerDrivers: t.makeServerDrivers = args => {
  const config = args.config
  const server = makeServer(config)
  const db = makeDb(config)
  const init: t.init = () =>
    server.serverListen().then((runningServer: any) => {
      return {
        close: () =>
          Promise.all([runningServer.close(), db.close()]).then(() => true),
        serverPort: runningServer.port as number,
      }
    })
  return {
    jwt,
    httpReq,
    db: db.driver,
    init,
    pubSub: new PubSub(config.GCP_PROJECT_ID),
    initRoutes: server.initRoutes,
    uuid: makeUuid(),
  }
}
