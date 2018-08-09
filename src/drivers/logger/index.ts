import { createLogger, transports } from 'winston'
import * as t from './types'

export const makeLogger: t.makeLogger = config => {
  const { LOG_LEVEL } = config

  const wLogger = createLogger({
    transports: [new transports.Console({ level: LOG_LEVEL })],
  })

  const info: t.info = msg => wLogger.info(msg, { timestamp: Date.now() })
  const error: t.error = msg => wLogger.error(msg, { timestamp: Date.now() })

  info(`Messages are now written to the Console at level '${LOG_LEVEL}'`)

  return {
    error,
    info,
  }
}
