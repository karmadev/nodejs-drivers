import * as cT from '../../config/types'

export type error = (msg: string) => void
export type info = (msg: string) => void

export interface ILogger {
  error: error
  info: info
}

export type makeLogger = (c: cT.IConfig) => ILogger
