import * as cT from '../config/types'
import * as psT from './pub-sub'
import * as hrT from './http-req/types'
import * as dbT from './db/types'
import * as lT from './logger/types'
import * as sT from './server/types'
import * as uT from './uuid/types'

export type close = () => Promise<boolean>

export interface IInitializedDrivers {
  close: close
  serverPort: number
}

export type init = () => Promise<IInitializedDrivers>

export interface IServerDrivers {
  jwt: any
  httpReq: hrT.httpReq
  db: dbT.driver
  init: init
  logger: lT.ILogger
  pubSub: psT.PubSub
  initRoutes: sT.initRoutes
  uuid: uT.uuid
}

export type makeServerDrivers = (args: { config: cT.IConfig }) => IServerDrivers
