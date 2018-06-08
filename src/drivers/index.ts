import { makeDb } from './db'
import { makeLogger } from './logger'
import { makeMsgBroker } from './msg-broker'
import { makeReport } from './report'
import { makeServer } from './server'
import { makeToken } from './token'

export const makeDrivers = args => {
  const { config } = args
  const logger = makeLogger(config)
  const { router, serverListen } = makeServer(config, logger)
  const { reportDriver, reportInitP } = makeReport(config)
  const { dbDriver, dbClose } = makeDb(config)
  const init = () =>
    Promise.all([serverListen(), reportInitP]).then(([server]: any[]) => {
      return {
        close: () =>
          Promise.all([server.close(), dbClose()]).then(() => undefined),
        serverPort: server.port,
      }
    })
  return {
    db: dbDriver,
    init,
    logger,
    msgBroker: makeMsgBroker(config, logger),
    report: reportDriver,
    router,
    token: makeToken(config),
  }
}
