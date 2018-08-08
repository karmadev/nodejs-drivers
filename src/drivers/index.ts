import { makeDb } from './db'
import { makeLogger } from './logger'
import { PubSub } from './pub-sub'
import { makeServer } from './server'
import { makeToken } from './token'
import { jwt } from './jwt'
import { httpReq } from './http-req'

export const makeServerDrivers = args => {
  const config = args.config
  const logger = makeLogger(config)
  const server = makeServer(config, logger)
  const { dbDriver, dbClose } = makeDb(config)
  const init = () =>
    server.serverListen().then((runningServer: any) => {
      return {
        close: () =>
          Promise.all([runningServer.close(), dbClose()]).then(() => true),
        serverPort: runningServer.port,
      }
    })
  return {
    jwt,
    httpReq,
    db: dbDriver,
    init,
    logger,
    msgBroker: new PubSub(config.GCP_PROJECT_ID, logger),
    initRoutes: server.initRoutes,
    token: makeToken(config),
  }
}
