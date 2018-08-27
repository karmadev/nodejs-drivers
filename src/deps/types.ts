import * as cT from '../config/types'
import * as dT from '../drivers/types'
import { ILogger } from '../drivers/logger'

export interface IServerDeps {
  config: cT.IConfig
  drivers: dT.IServerDrivers
}

export interface IMakeServerDepsArgs {
  config: cT.IConfigArgs
  logger: ILogger
}

export type makeServerDeps = (args: IMakeServerDepsArgs) => IServerDeps
