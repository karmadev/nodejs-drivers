import * as cT from '../../config//types'
import { createLogger, transports } from 'winston'

export const makeLogger = (config: cT.IConfig) => {
  const { LOG_LEVEL } = config

  const wLogger = createLogger({
    transports: [new transports.Console({ level: LOG_LEVEL })],
  })

  const info = (msg: any) => wLogger.info(msg, { timestamp: Date.now() })
  const error = (msg: any) => wLogger.error(msg, { timestamp: Date.now() })

  info(`Messages are now written to the Console at level '${LOG_LEVEL}'`)

  return {
    error,
    info,
  }
}
