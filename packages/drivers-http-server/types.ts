import * as cT from '../../config/types'

export interface IRoute {
  url: string
  contentType: string
  method: string
  model: string
  params?: string[]
  body?: string[]
}

export type initRoutes = (args: { routes: IRoute[]; model: any }) => void

export interface IServer {
  router: any
  initRoutes: initRoutes
  serverListen: any
}

export type makeServer = (config: cT.IConfig) => IServer