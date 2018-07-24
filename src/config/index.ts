// @TODO: Continue here.

// ### prefix
// All environment variables except NODE_ENV should be prefixed by some unique string.
// This allows us to filter out not needed environment variables from the config object.
// Example prefix: "KSALO_" or "MYAPP_".

// ### removeToken
// Will remove key/val pairs where the val === removeToken (usually `'__NONE__'`).
// This is to be explicit about what values we don't want to use in our code instead of using empty strings,
// which might actually be a value we want to use, and not remove.

// ## Returns
// A config object with all the keys starting with the `prefix`, excluding the ones with a `removeToken`.

import * as t from './types'

const makeFilterToPrefixed: t.makeFilterToPrefixed = prefix => ([key, _]) =>
  key.startsWith(prefix)

const makeFilterToPopulatedValues: t.makeFilterToPopulatedValues = removeToken => ([
  key,
  val,
]) => val !== removeToken

const reduceToConfigObject: t.reduceToConfigObject = (
  accumulator,
  [key, val]
) => ({
  ...accumulator,
  [key]: val,
})

const mapToBoolOrId: t.mapToBoolOrId = ([key, val]) => {
  switch (val) {
    case 'true':
      return [key, true]
    case 'false':
      return [key, false]
    default:
      return [key, val]
  }
}

const mapToNoPrefix: t.mapToNoPrefix = prefix => ([key, val]) => [
  key.split(prefix)[1],
  val,
]

export const makeConfig: t.makeConfig = args => {
  const { envVars, prefix, removeToken } = args

  return Object.entries(envVars)
    .filter(makeFilterToPrefixed(prefix))
    .filter(makeFilterToPopulatedValues(removeToken))
    .map(mapToBoolOrId)
    .map(mapToNoPrefix(prefix))
    .reduce(reduceToConfigObject, {})
}
