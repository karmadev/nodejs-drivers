import * as cT from '../../config/types'

export type close = () => void

export type driver = (
  sql: string,
  options: { type: string; bind: any }
) => Promise<any>

export interface IDb {
  close: close
  driver: driver
}

export type makeDb = (c: cT.IConfig) => IDb
