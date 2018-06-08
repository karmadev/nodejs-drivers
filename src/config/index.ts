import { IConfigArgs } from './types'

const makeFilterToPrefixed: any = prefix => ([key]) => key.startsWith(prefix)

const makeFilterToPopulatedValues = removeToken => ([key, val]) =>
  val !== removeToken

const reduceToConfigObject: any = (accumulator, [key, val]) => ({
  ...accumulator,
  [key]: val,
})

const mapToBool = ([key, val]) => {
  switch (val) {
    case 'true':
      return [key, true]
    case 'false':
      return [key, false]
    default:
      return [key, val]
  }
}

const mapToNoPrefix: any = prefix => ([key, val]) => [key.split(prefix)[1], val]

const initConfig = (props: IConfigArgs) => {
  const { envVars, prefix, removeToken } = props

  return Object.entries(envVars)
    .filter(makeFilterToPrefixed(prefix))
    .filter(makeFilterToPopulatedValues(removeToken))
    .map(mapToBool)
    .map(mapToNoPrefix(prefix))
    .reduce(reduceToConfigObject, {})
}

export const makeConfig = (args: IConfigArgs) => {
  const { envVars, prefix, removeToken } = args

  return Object.entries(envVars)
    .filter(makeFilterToPrefixed(prefix))
    .filter(makeFilterToPopulatedValues(removeToken))
    .map(mapToBool)
    .map(mapToNoPrefix(prefix))
    .reduce(reduceToConfigObject, {})
}
