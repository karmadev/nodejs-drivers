import * as cT from '../config/types'
import * as dT from '../drivers/types'

export interface IServerDeps {
  config: cT.IConfig
  drivers: dT.IServerDrivers
}

export type makeServerDeps = (c: cT.IConfigArgs) => IServerDeps
