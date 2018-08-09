import * as cT from '../config/types'

export interface IServerDrivers {
  jwt: any
  httpReq: any
  db: any
  init: any
  logger: any
  msgBroker: any
  initRoutes: any
  token: any
}

export type makeServerDrivers = (args: { config: cT.IConfig }) => IServerDrivers
