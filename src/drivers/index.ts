import { makeDb } from './db'
import { makeLogger } from './logger'
import { PubSub } from './pub-sub'
import { makeServer } from './server'
import { makeUuid } from './uuid'
import * as jwt from './jwt'
import { httpReq } from './http-req'
import * as t from './types'

export const makeServerDrivers: t.makeServerDrivers = args => {
  const config = args.config
  const logger = makeLogger(config)
  const server = makeServer(config, logger)
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
    logger,
    pubSub: new PubSub(config.GCP_PROJECT_ID, logger),
    initRoutes: server.initRoutes,
    uuid: makeUuid(),
  }
}
