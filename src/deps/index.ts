import { makeConfig } from '../config'
import { IConfigArgs } from '../config/types'
import { makeServerDrivers } from '../drivers'

export const makeServerDeps = (configOpts: IConfigArgs) => {
  const config = makeConfig(configOpts)
  const drivers = makeServerDrivers({ config })
  return {
    config,
    drivers,
  }
}
