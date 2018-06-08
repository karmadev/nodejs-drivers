import * as winston from 'winston'

export const makeLogger = config => {
  const { LOG_LEVEL } = config
  const wLogger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        colorize: true,
      }),
    ],
  })

  const info = msg => wLogger.info(msg, { timestamp: Date.now() })
  const error = msg => wLogger.error(msg, { timestamp: Date.now() })

  info(`Messages are now written to the Console at level '${LOG_LEVEL}'`)

  return {
    error,
    info,
  }
}
