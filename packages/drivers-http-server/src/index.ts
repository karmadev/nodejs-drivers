import * as bodyParser from 'body-parser'
import * as express from 'express'
import { IRoute, MakeServer, InitRoutes, IServer } from './types'
import { IConfig } from '@karmalicious/drivers-config'

const makeRouter = (expressRouter: express.Router) => (
  route: IRoute,
  modelMethod: (input: any) => any
) => {
  const relativeBaseUrl = route.url

  const routeUrl = route.params
    ? [`/${relativeBaseUrl}`].concat(route.params).join('/:')
    : `/${relativeBaseUrl}`

  expressRouter[route.method](
    routeUrl,
    (req: express.Request, res: express.Response) => {
      const reqArgsSource = route.body ? req.body : req.params
      const routeArgsSource = route.body ? route.body : route.params
      if (routeArgsSource == null) {
        throw new Error('routeArgsSource cannot be null or undefined.')
      }
      const routeArgs = routeArgsSource.reduce((acc, bodyKey) => {
        acc[bodyKey] = reqArgsSource[bodyKey]
        return acc
      }, {})

      const resHandler =
        route.contentType === 'application/pdf'
          ? (pdfStream: any) => {
              res.contentType('application/pdf')
              pdfStream.pipe(res)
            }
          : route.contentType === 'text/csv'
            ? (data: any) => {
                res.header({
                  'Content-Type': 'text/csv',
                  'Content-disposition':
                    'attachment; filename=' + req.url + '.csv',
                })
                res.send(data)
              }
            : (data: any) => {
                res.json(data)
              }

      modelMethod(routeArgs)
        .then(resHandler)
        .catch((err: any) => {
          const clientError = {
            message: err.message,
          }
          // @TODO: Handle error.
          // logger.error(err)
          res.json(clientError)
        })
    }
  )
}

const makeListen = (expressListen: any, port: string | number) => () =>
  new Promise((resolve, _) => {
    const httpServer = expressListen(port, () => {
      const close = makeClose(httpServer.close.bind(httpServer), port)
      resolve({ close, port })
    })
  })

const makeClose = (expressClose: any, port: string | number) => () =>
  new Promise((resolve, _) => {
    expressClose(() => {
      resolve(port)
    })
  })

export const makeServer: MakeServer = (config: IConfig) => {
  const { SERVER_PORT: serverPort } = config

  const expressServer = express()
  const expressUse = expressServer.use.bind(expressServer)
  const expressRouter = express.Router()
  const listenExpress = expressServer.listen.bind(expressServer)

  expressUse(bodyParser.json())
  expressUse('/', expressRouter)

  const router = makeRouter(expressRouter)

  const initRoutes: InitRoutes = ({ routes, model }) => {
    routes.forEach(route => router(route, model[route.model]))
  }

  const server: IServer = {
    router,
    initRoutes,
    serverListen: makeListen(listenExpress, serverPort),
  }

  return server
}
