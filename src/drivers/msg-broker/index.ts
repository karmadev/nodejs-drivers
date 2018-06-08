import * as amqplib from 'amqplib'
import * as uuidV4 from 'uuid/v4'

const makeOngoingMsgs = (chanP, timeoutMs, logger) => {
  const reqResHandlerStore = new Map()

  const resolveReq = msg =>
    chanP.then(chan => {
      const handler = reqResHandlerStore.get(msg.properties.correlationId)

      if (!handler) {
        logger.info(
          `No handler found for correlationId [${
            msg.properties.correlationId
          }]. The request might have timed out.`
        )
      }

      handler(msg)
    })

  const registerReq = correlationId =>
    chanP.then(
      () =>
        new Promise((resolve, reject) => {
          const timeoutHandler = setTimeout(() => {
            reqResHandlerStore.delete(correlationId)
            reject(
              new Error(
                `Registered request with correlationId [${correlationId}] timed out after [${timeoutMs}]ms.`
              )
            )
          }, timeoutMs)
          reqResHandlerStore.set(correlationId, msg => {
            clearTimeout(timeoutHandler)
            reqResHandlerStore.delete(correlationId)
            resolve(msg)
          })
        })
    )

  return { resolveReq, registerReq }
}

const makeSendRequest = (chanP, timeoutMs, logger, drierOpts) => {
  const { exchangeName, routingKey, replyTo } = drierOpts
  const ongoingMsgs = makeOngoingMsgs(chanP, timeoutMs, logger)
  const assertedP = chanP.then(chan =>
    Promise.all([
      // @TODO(MANI): Set exchanges to durable: true when it works for Karma's RabbitMQ setup.
      chan.assertExchange(exchangeName, 'direct', { durable: false }),
      chan.assertQueue(replyTo, { durable: true }),
    ])
      .then(() =>
        chan.consume(replyTo, msg => {
          chan.ack(msg)
          ongoingMsgs.resolveReq(msg)
        })
      )
      .then(() => chan)
  )

  return data =>
    assertedP.then(chan => {
      const correlationId = uuidV4()
      const jsonData = JSON.stringify(data)

      const resP = ongoingMsgs.registerReq(correlationId)
      chan.publish(exchangeName, routingKey, Buffer.from(jsonData), {
        correlationId,
        replyTo,
      })

      return resP.then(msg => {
        const parsedMsgContent = JSON.parse(msg.content.toString())
        return parsedMsgContent
      })
    })
}

const makeSendCommand = (chanP, driverOpts) => {
  const { exchangeName, routingKey } = driverOpts
  const assertedP = chanP.then(chan =>
    Promise.all([
      // @TODO(MANI): Set exchanges to durable: true when it works for Karma's RabbitMQ setup.
      chan.assertExchange(exchangeName, 'direct', { durable: false }),
    ]).then(() => chan)
  )
  return data =>
    assertedP.then(chan => {
      const jsonData = JSON.stringify(data)
      chan.publish(exchangeName, routingKey, Buffer.from(jsonData))
      return true
    })
}

export const makeMsgBroker = (config, logger) => {
  const { MSG_BROKER_CONN_STRING, MSG_BROKER_TIMEOUT_MS } = config
  const timeoutMs = MSG_BROKER_TIMEOUT_MS
  const connString = MSG_BROKER_CONN_STRING
  const chanP = amqplib.connect(connString).then(conn => conn.createChannel())
  const makeMsgBrokerDriver = driverOpts => {
    switch (driverOpts.type) {
      case 'request':
        return makeSendRequest(chanP, timeoutMs, logger, driverOpts)
      case 'command':
        return makeSendCommand(chanP, driverOpts)
      default:
        return Promise.reject(
          new Error('MsgBroker only supports `type="request"|"command"`.')
        )
    }
  }
  return makeMsgBrokerDriver
}

export const internal = {
  makeOngoingMsgs,
}
