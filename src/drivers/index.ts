import { makeDb } from './db'
import { makeLogger } from './logger'
import { PubSub } from './pub-sub'
import { makeServer } from './server'
import { makeToken } from './token'
import * as jwt from './jwt'
import { httpReq } from './http-req'
import * as t from './types'

export const makeServerDrivers: t.makeServerDrivers = args => {
  const config = args.config
  const logger = makeLogger(config)
  const server = makeServer(config, logger)
  const db = makeDb(config)
  const init = () =>
    server.serverListen().then((runningServer: any) => {
      return {
        close: () =>
          Promise.all([runningServer.close(), db.close()]).then(() => true),
        serverPort: runningServer.port,
      }
    })
  return {
    jwt,
    httpReq,
    db: db.driver,
    init,
    logger,
    msgBroker: new PubSub(config.GCP_PROJECT_ID, logger),
    initRoutes: server.initRoutes,
    token: makeToken(config),
  }
}
