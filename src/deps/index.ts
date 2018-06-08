import { makeConfig } from '../config'
import { IConfigArgs } from '../config/types'
import { makeDrivers } from '../drivers'

export const makeDeps = (configOpts: IConfigArgs) => {
  const config = makeConfig(configOpts)
  const drivers = makeDrivers({ config })
  return {
    config,
    drivers,
  }
}
