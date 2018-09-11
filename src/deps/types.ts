import * as cT from '../config/types'
import * as dT from '../drivers/types'

export interface IServerDeps {
  config: cT.IConfig
  drivers: dT.IServerDrivers
}

export interface IMakeServerDepsArgs {
  config: cT.IConfigArgs
}

export type makeServerDeps = (args: IMakeServerDepsArgs) => IServerDeps
