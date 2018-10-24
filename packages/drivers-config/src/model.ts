const filterPrefixed = (prefix: string) => ([key, _]: [string, any]): boolean =>
  key.startsWith(prefix)

function reduceToConfigObject(
  accumulator: { [key: string]: string },
  [key, val]: [string, string]
): { [key: string]: string } {
  accumulator[key] = val
  return accumulator
}

const reduceToExternals = (definedEnvVars: { [s: string]: string }) => (
  acc: { [s: string]: string },
  externalKey: string
) => {
  if (definedEnvVars[externalKey]) {
    acc[externalKey] = definedEnvVars[externalKey]
  }
  return acc
}

const mapToNoPrefix = (prefix: string) => ([key, val]: [string, string]): [
  string,
  string
] => [key.split(prefix)[1], val]

/**
 *
 * @param prefix All environment variables except NODE_ENV should be prefixed by some unique string.
 * This allows us to filter out not needed environment variables from the config object.
 * Example prefix: "KSALO_" or "MYAPP_".
 * @param envVars The environment variables, normally process.env unless running tests.
 * @returns An object with all the keys that had the `prefix` and aren't undefined. All keys have the prefix stripped.
 */
export function Config(
  prefix: string,
  envVars: {
    [s: string]: string | undefined
  },
  externalKeys: string[]
): {
  [s: string]: string
} {
  const definedEnvVars: { [s: string]: string } = Object.entries(
    envVars
  ).reduce(
    (acc, [key, val]) => {
      if (typeof val !== 'undefined') {
        acc[key] = val
      }
      return acc
    },
    {} as {
      [s: string]: string
    }
  )

  const externals = externalKeys.reduce(reduceToExternals(definedEnvVars), {})

  return Object.entries(definedEnvVars)
    .filter(filterPrefixed(prefix))
    .map(mapToNoPrefix(prefix))
    .reduce(reduceToConfigObject, externals)
}
