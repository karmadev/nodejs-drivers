import { createLogger, transports } from 'winston'
// const winston = w as any

export const makeLogger = (config: any) => {
  const { LOG_LEVEL } = config
  const wLogger = createLogger({
    transports: [new transports.Console()],
  })

  const info = (msg: any) => wLogger.info(msg, { timestamp: Date.now() })
  const error = (msg: any) => wLogger.error(msg, { timestamp: Date.now() })

  info(`Messages are now written to the Console at level '${LOG_LEVEL}'`)

  return {
    error,
    info,
  }
}
