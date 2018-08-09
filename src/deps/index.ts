import { makeConfig } from '../config'

import { makeServerDrivers } from '../drivers'
import * as t from './types'

export const makeServerDeps: t.makeServerDeps = opts => {
  const config = makeConfig(opts)
  const drivers = makeServerDrivers({ config })
  return {
    config,
    drivers,
  }
}
