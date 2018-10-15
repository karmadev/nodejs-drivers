import { IConfig } from '@karmalicious/drivers-config'

export interface IRoute {
  url: string
  contentType: string
  method: string
  model: string
  params?: string[]
  body?: string[]
}

export type InitRoutes = (args: { routes: IRoute[]; model: any }) => void

export interface IServer {
  router: any
  initRoutes: InitRoutes
  serverListen: any
}

export type MakeServer = (config: IConfig) => IServer
