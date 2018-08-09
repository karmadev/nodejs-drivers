import * as bodyParser from 'body-parser'
import * as makeExpress from 'express'
import * as t from './types'

const makeRouter = (expressRouter: makeExpress.Router, logger: any) => (
  routeDef,
  modelMethod
) => {
  const relativeBaseUrl = routeDef.url

  const routeUrl = routeDef.params
    ? [`/${relativeBaseUrl}`].concat(routeDef.params).join('/:')
    : `/${relativeBaseUrl}`

  expressRouter[routeDef.method](routeUrl, (req, res) => {
    const reqArgsSource = routeDef.body ? req.body : req.params
    const routeDefArgsSource = routeDef.body ? routeDef.body : routeDef.params
    const routeArgs = routeDefArgsSource.reduce((acc, bodyKey) => {
      acc[bodyKey] = reqArgsSource[bodyKey]
      return acc
    }, {})

    const resHandler =
      routeDef.contentType === 'application/pdf'
        ? pdfStream => {
            res.contentType('application/pdf')
            pdfStream.pipe(res)
          }
        : routeDef.contentType === 'text/csv'
          ? data => {
              res.header({
                'Content-Type': 'text/csv',
                'Content-disposition':
                  'attachment; filename=' + req.url + '.csv',
              })
              res.send(data)
            }
          : data => {
              res.json(data)
            }

    modelMethod(routeArgs)
      .then(resHandler)
      .catch(err => {
        const clientError = {
          message: err.message,
        }
        logger.error(err)
        res.json(clientError)
      })
  })
}

const makeListen = (expressListen, port) => () =>
  new Promise((resolve, reject) => {
    const httpServer = expressListen(port, () => {
      const close = makeClose(httpServer.close.bind(httpServer), port)
      resolve({ close, port })
    })
  })

const makeClose = (expressClose, port) => () =>
  new Promise((resolve, reject) => {
    expressClose(() => {
      resolve(port)
    })
  })

export const makeServer: t.makeServer = (config, logger) => {
  const { SERVER_PORT: serverPort } = config

  const expressServer = makeExpress()
  const expressUse = expressServer.use.bind(expressServer)
  const expressRouter = makeExpress.Router()
  const listenExpress = expressServer.listen.bind(expressServer)

  expressUse(bodyParser.json())
  expressUse('/', expressRouter)

  const router = makeRouter(expressRouter, logger)

  const initRoutes: t.initRoutes = ({ routes, model }) => {
    routes.forEach(route => router(route, model[route.model]))
  }

  const server: t.IServer = {
    router,
    initRoutes,
    serverListen: makeListen(listenExpress, serverPort),
  }

  return server
}
